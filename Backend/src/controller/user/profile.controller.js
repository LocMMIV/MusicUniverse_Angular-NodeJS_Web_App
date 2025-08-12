import bcrypt from "bcrypt";
import { pool } from "../../db.js";
import { filePublicPath } from "../../middlewares/upload.js";

/** GET /api/users/me (JWT) */
export const getMe = async (req, res, next) => {
  try {
    const [[u]] = await pool.query(
      `SELECT id, name, account_name, email, role, is_locked, locked_at, avatar_url, created_at
       FROM users WHERE id=?`,
      [req.auth.id]
    );
    if (!u) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ user: u });
  } catch (e) { next(e); }
};

/** PUT /api/users/me (JWT) — cập nhật name, account_name, avatar(optional)  */
export const updateMe = async (req, res, next) => {
  try {
    const id = req.auth.id;
    const { name, account_name } = req.body || {};

    // ảnh avatar (nếu upload)
    const avatar = filePublicPath(req.files?.avatar?.[0]); // /uploads/avatars/....

    // lấy hiện trạng
    const [[cur]] = await pool.query(`SELECT * FROM users WHERE id=?`, [id]);
    if (!cur) return res.status(404).json({ message: "Không tìm thấy user" });

    const newName = (name ?? cur.name).trim();
    const newAcct = (account_name ?? cur.account_name).trim();
    const newAvatar = avatar ?? cur.avatar_url;

    await pool.query(
      `UPDATE users SET name=?, account_name=?, avatar_url=? WHERE id=?`,
      [newName, newAcct, newAvatar, id]
    );

    const [[u]] = await pool.query(
      `SELECT id, name, account_name, email, role, is_locked, locked_at, avatar_url, created_at
       FROM users WHERE id=?`,
      [id]
    );
    res.json({ user: u });
  } catch (e) {
    if (e?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "account_name đã tồn tại" });
    }
    next(e);
  }
};

/** PATCH /api/users/me/password (JWT) — đổi mật khẩu */
export const changePassword = async (req, res, next) => {
  try {
    const id = req.auth.id;
    const { old_password, new_password } = req.body || {};
    if (!old_password || !new_password) {
      return res.status(400).json({ message: "Thiếu old_password hoặc new_password" });
    }
    if (String(new_password).length < 6) {
      return res.status(400).json({ message: "Mật khẩu tối thiểu 6 ký tự" });
    }

    const [[u]] = await pool.query(`SELECT password_hash FROM users WHERE id=?`, [id]);
    if (!u) return res.status(404).json({ message: "Không tìm thấy user" });

    const ok = await bcrypt.compare(old_password, u.password_hash || "");
    if (!ok) return res.status(401).json({ message: "Mật khẩu cũ không đúng" });

    const hash = await bcrypt.hash(new_password, 10);
    await pool.query(`UPDATE users SET password_hash=? WHERE id=?`, [hash, id]);

    res.json({ ok: true });
  } catch (e) { next(e); }
};
    