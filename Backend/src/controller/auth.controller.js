import bcrypt from "bcrypt";
import { pool } from "../db.js";
import { signToken, toPublicUser } from "../middlewares/authJwt.js";

/** POST /api/auth/register  { name, email, account_name?, password } */
export const register = async (req, res, next) => {
  try {
    const { name, email, account_name, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password là bắt buộc" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Mật khẩu tối thiểu 6 ký tự" });
    }

    // auto account_name nếu không gửi
    const acct = account_name?.trim() || email.split("@")[0];

    const hash = await bcrypt.hash(password, 10);

    const [r] = await pool.query(
      `INSERT INTO users (name, email, account_name, password_hash, role)
       VALUES (?,?,?,?, 'user')`,
      [name.trim(), email.trim(), acct, hash]
    );

    const [[user]] = await pool.query(`SELECT * FROM users WHERE id=?`, [r.insertId]);
    const token = signToken(user);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    // trùng email/account_name
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email hoặc account_name đã tồn tại" });
    }
    next(err);
  }
};

/** POST /api/auth/login  { email, password } */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email và password là bắt buộc" });
    }

    const [[user]] = await pool.query(`SELECT * FROM users WHERE email=?`, [email.trim()]);
    if (!user) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

    if (user.is_locked) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa", locked_at: user.locked_at });
    }

    const ok = await bcrypt.compare(password, user.password_hash || "");
    if (!ok) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
};

/** GET /api/auth/me (JWT) */
export const me = async (req, res, next) => {
  try {
    const [[user]] = await pool.query(`SELECT * FROM users WHERE id=?`, [req.auth.id]);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
};
