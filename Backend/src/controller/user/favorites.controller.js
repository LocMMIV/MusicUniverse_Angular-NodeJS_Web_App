import { pool } from "../../db.js";

/** GET /api/favorites  (của user hiện tại) */
export const listMyFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query(
            `SELECT s.*, g.name AS genre_name
            FROM favorites f
            JOIN songs s ON s.id = f.song_id
            LEFT JOIN genres g ON g.id = s.genre_id
            WHERE f.user_id = ?
            ORDER BY s.created_at DESC`,
            [userId]
        );
        res.json({ data: rows });
    } catch (err) {
        next(err);
    }
};

/** POST /api/favorites/:songId  -> toggle like/unlike */
export const toggleFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const songId = Number(req.params.songId);

        // thử insert
        const [r1] = await pool.query(
            `INSERT IGNORE INTO favorites (user_id, song_id) VALUES (?, ?)`,
            [userId, songId]
        );

        if (r1.affectedRows === 1) {
            // mới like
            return res.json({ liked: true });
        }

        // đã tồn tại => xóa (unlike)
        const [r2] = await pool.query(
            `DELETE FROM favorites WHERE user_id=? AND song_id=?`,
            [userId, songId]
        );
        return res.json({ liked: false, removed: r2.affectedRows === 1 });
    } catch (err) {
        next(err);
    }
};

/** GET /api/favorites/:songId -> user đã like bài này chưa */
export const isFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const songId = Number(req.params.songId);

        const [[row]] = await pool.query(
            `SELECT 1 AS ok FROM favorites WHERE user_id=? AND song_id=? LIMIT 1`,
            [userId, songId]
        );
        res.json({ liked: !!row });
    } catch (err) {
        next(err);
    }
};

/** DELETE /api/favorites/:songId -> xóa hẳn yêu thích */
export const removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const songId = Number(req.params.songId);

        const [r] = await pool.query(
            `DELETE FROM favorites WHERE user_id=? AND song_id=?`,
            [userId, songId]
        );
        if (r.affectedRows === 0) {
            return res.status(404).json({ message: "Không có trong danh sách yêu thích" });
        }
    res.json({ ok: true });
    } catch (err) {
        next(err);
    }
};