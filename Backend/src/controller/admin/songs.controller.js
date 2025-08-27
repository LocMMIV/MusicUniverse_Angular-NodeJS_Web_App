import { pool } from "../../db.js";

// helper
const filePublicPath = (file) => (file ? `/${file.path.replace(/\\/g, "/")}` : null);

/** GET /api/songs?q=&genre_id=&mine=&page=&limit= */
export const listSongs = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const genreId = req.query.genre_id ? Number(req.query.genre_id) : null;
    const mine = req.query.mine === "1" || req.query.mine === "true";

    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    if (q) {
      where.push("(s.title LIKE ? OR s.artist_name LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (genreId) {
      where.push("s.genre_id = ?");
      params.push(genreId);
    }
    if (mine) {
      // Chỉ cho phép mine khi đã đăng nhập
      if (!req.auth?.id) return res.status(401).json({ message: "Unauthorized" });
      where.push("s.uploader_id = ?");
      params.push(req.auth.id);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT
         s.id, s.title, s.artist_name, s.genre_id, s.uploader_id,
         g.name AS genre_name,
         s.duration_sec, s.audio_url, s.image_url, s.lyrics,
         s.created_at, s.updated_at
       FROM songs s
       LEFT JOIN genres g ON g.id = s.genre_id
       ${whereSql}
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) total FROM songs s
       ${whereSql}`,
      params
    );

    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) { next(err); }
};

/** GET /api/songs/:id */
export const getSongById = async (req, res, next) => {
  try {
    const [[row]] = await pool.query(
      `SELECT
         s.id, s.title, s.artist_name, s.genre_id, s.uploader_id,
         g.name AS genre_name,
         s.duration_sec, s.audio_url, s.image_url, s.lyrics,
         s.created_at, s.updated_at
       FROM songs s
       LEFT JOIN genres g ON g.id = s.genre_id
       WHERE s.id = ?`,
      [req.params.id]
    );
    if (!row) return res.status(404).json({ message: "Không tìm thấy bài hát" });
    res.json(row);
  } catch (err) { next(err); }
};

/** POST /api/songs (multipart/form-data) */
export const createSong = async (req, res, next) => {
  try {
    // yêu cầu JWT
    if (!req.auth?.id) return res.status(401).json({ message: "Unauthorized" });

    const {
      title,
      artist_name,
      genre_id = null,
      duration_sec = null,
      lyrics = null,
    } = req.body || {};
    const image_url = filePublicPath(req.files?.image?.[0]);
    const audio_url = filePublicPath(req.files?.audio?.[0]);

    if (!title || !artist_name || !audio_url) {
      return res.status(400).json({ message: "title, artist_name và audio (file) là bắt buộc" });
    }

    const [r] = await pool.query(
      `INSERT INTO songs
         (title, artist_name, genre_id, duration_sec, audio_url, image_url, lyrics, uploader_id)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        title.trim(),
        artist_name.trim(),
        genre_id || null,
        duration_sec || null,
        audio_url,
        image_url,
        lyrics,
        req.auth.id,      // <- GẮN CHỦ UPLOAD
      ]
    );

    const [[row]] = await pool.query(
      `SELECT s.*, g.name AS genre_name
       FROM songs s LEFT JOIN genres g ON g.id = s.genre_id
       WHERE s.id=?`,
      [r.insertId]
    );
    res.status(201).json(row);
  } catch (err) { next(err); }
};

/** PUT /api/songs/:id (multipart/form-data) */
export const updateSong = async (req, res, next) => {
  try {
    if (!req.auth?.id) return res.status(401).json({ message: "Unauthorized" });

    const id = Number(req.params.id);
    const { title, artist_name, genre_id = null, duration_sec = null, lyrics = null } = req.body || {};

    if (!title || !artist_name) {
      return res.status(400).json({ message: "title, artist_name là bắt buộc" });
    }

    // chỉ chủ sở hữu hoặc admin mới được sửa
    const [[owner]] = await pool.query(`SELECT uploader_id, audio_url, image_url FROM songs WHERE id=?`, [id]);
    if (!owner) return res.status(404).json({ message: "Không tìm thấy bài hát" });
    const isAdmin = req.auth?.role === "admin";
    if (!isAdmin && owner.uploader_id !== req.auth.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newImage = filePublicPath(req.files?.image?.[0]) || owner.image_url;
    const newAudio = filePublicPath(req.files?.audio?.[0]) || owner.audio_url;
    if (!newAudio) return res.status(400).json({ message: "Audio là bắt buộc" });

    const [r] = await pool.query(
      `UPDATE songs SET
         title=?, artist_name=?, genre_id=?, duration_sec=?, audio_url=?, image_url=?, lyrics=?
       WHERE id=?`,
      [title.trim(), artist_name.trim(), genre_id || null, duration_sec || null, newAudio, newImage, lyrics, id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy bài hát" });

    const [[row]] = await pool.query(
      `SELECT s.*, g.name AS genre_name
       FROM songs s LEFT JOIN genres g ON g.id = s.genre_id
       WHERE s.id=?`,
      [id]
    );
    res.json(row);
  } catch (err) { next(err); }
};

/** DELETE /api/songs/:id */
export const deleteSong = async (req, res, next) => {
  try {
    if (!req.auth?.id) return res.status(401).json({ message: "Unauthorized" });

    const id = Number(req.params.id);
    const [[owner]] = await pool.query(`SELECT uploader_id FROM songs WHERE id=?`, [id]);
    if (!owner) return res.status(404).json({ message: "Không tìm thấy bài hát" });

    const isAdmin = req.auth?.role === "admin";
    if (!isAdmin && owner.uploader_id !== req.auth.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [r] = await pool.query(`DELETE FROM songs WHERE id=?`, [id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy bài hát" });
    res.json({ ok: true });
  } catch (err) { next(err); }
};