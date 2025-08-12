import { pool } from "../../db.js";

/** POST /api/requests  (user gửi hỗ trợ)
 * body: { full_name, account_name?, email, topic, subject, content }
 * topic: 'ky_thuat' | 'tai_khoan' | 'thanh_toan' | 'khac'
 */
export const createSupportRequest = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const {
      full_name,
      account_name = null,
      email,
      topic = 'khac',
      subject,
      content,
    } = req.body || {};

    if (!full_name || !email || !subject || !content) {
      return res.status(400).json({ message: "full_name, email, subject, content là bắt buộc" });
    }

    const [r] = await pool.query(
      `INSERT INTO support_requests
        (user_id, full_name, account_name, email, topic, subject, content)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, full_name, account_name, email, topic, subject, content]
    );

    const [[row]] = await pool.query(
      `SELECT * FROM support_requests WHERE id=?`, [r.insertId]
    );
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
};

/** GET /api/requests/my  (user xem list yêu cầu của mình) */
export const listMySupportRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT * FROM support_requests
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};
