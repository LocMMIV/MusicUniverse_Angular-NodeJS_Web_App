import { pool } from "../../db.js";

/** GET /api/genres?q=&page=&limit= */
export const listGenres = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];
    if (q) {
      where.push(`name LIKE ?`);
      params.push(`%${q}%`);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
        `SELECT id, name, created_at, updated_at
        FROM genres
        ${whereSql}
        ORDER BY name ASC
        LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) total FROM genres ${whereSql}`,
      params
    );

    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/genres/:id */
export const getGenreById = async (req, res, next) => {
  try {
    const [[row]] = await pool.query(
      `SELECT id, name, created_at, updated_at FROM genres WHERE id=?`,
      [req.params.id]
    );
    if (!row) return res.status(404).json({ message: "Không tìm thấy thể loại" });
    res.json(row);
  } catch (err) {
    next(err);
  }
};

/** POST /api/genres  { name } */
export const createGenre = async (req, res, next) => {
  try {
    const name = (req.body?.name || "").trim();
    if (!name) return res.status(400).json({ message: "Tên thể loại là bắt buộc" });

    const [r] = await pool.query(`INSERT INTO genres(name) VALUES (?)`, [name]);
    const [[row]] = await pool.query(
      `SELECT id, name, created_at, updated_at FROM genres WHERE id=?`,
      [r.insertId]
    );
    res.status(201).json(row);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Tên thể loại đã tồn tại" });
    }
    next(err);
  }
};

/** PUT /api/genres/:id  { name } */
export const updateGenre = async (req, res, next) => {
  try {
    const name = (req.body?.name || "").trim();
    if (!name) return res.status(400).json({ message: "Tên thể loại là bắt buộc" });

    const [r] = await pool.query(`UPDATE genres SET name=? WHERE id=?`, [
      name,
      req.params.id,
    ]);
    if (r.affectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy thể loại" });

    const [[row]] = await pool.query(
      `SELECT id, name, created_at, updated_at FROM genres WHERE id=?`,
      [req.params.id]
    );
    res.json(row);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Tên thể loại đã tồn tại" });
    }
    next(err);
  }
};

/** DELETE /api/genres/:id */
export const deleteGenre = async (req, res, next) => {
  try {
    // FK ở songs ON DELETE SET NULL → xóa genre an toàn
    const [r] = await pool.query(`DELETE FROM genres WHERE id=?`, [req.params.id]);
    if (r.affectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy thể loại" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
