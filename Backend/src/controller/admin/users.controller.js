// src/controller/admin/users.controller.js
import { pool } from "../../db.js";

// Danh sách users có tìm kiếm + phân trang
export const adminListUsers = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];
    if (q) {
      where.push(`(u.name LIKE ? OR u.email LIKE ? OR u.account_name LIKE ?)`);
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.account_name, u.email, u.role,
              u.is_locked, u.locked_at, u.locked_reason, u.created_at
       FROM users u
       ${whereSql}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) total FROM users u ${whereSql}`, params
    );

    res.json({ data: rows, pagination: { page, limit, total, pages: Math.ceil(total/limit) }});
  } catch (e) { next(e); }
};

// Khóa / mở khóa user
export const adminSetLockUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { lock = true, reason = null } = req.body || {};
    const [r] = await pool.query(
      `UPDATE users
       SET is_locked=?, locked_at = CASE WHEN ?=1 THEN NOW() ELSE NULL END, locked_reason=?
       WHERE id=?`,
      [lock ? 1 : 0, lock ? 1 : 0, reason, id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ message: "User không tồn tại" });
    res.json({ ok: true, locked: !!lock });
  } catch (e) { next(e); }
};

// (Thêm) Xem chi tiết 1 user
export const adminGetUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [[u]] = await pool.query(
      `SELECT id, name, account_name, email, role, is_locked, locked_at, locked_reason, created_at
       FROM users WHERE id=?`,
      [id]
    );
    if (!u) return res.status(404).json({ message: "User không tồn tại" });
    res.json(u);
  } catch (e) { next(e); }
};

// (Thêm) Đổi role user
export const adminSetRole = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const role = (req.body?.role || "").toLowerCase();
    if (!["user","admin"].includes(role)) {
      return res.status(400).json({ message: "role không hợp lệ" });
    }
    const [r] = await pool.query(`UPDATE users SET role=? WHERE id=?`, [role, id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: "User không tồn tại" });
    res.json({ ok: true, role });
  } catch (e) { next(e); }
};
