import { pool } from "../../db.js";

/** GET /api/requests  (admin) 
 * ?status=mo|dang_xu_ly|da_giai_quyet & q= (search name/email/subject)
 * + pagination: page, limit
 */
export const adminListSupportRequests = async (req, res, next) => {
  try {
    const { status, q = "" } = req.query;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];
    if (status) {
      where.push(`sr.status = ?`);
      params.push(status);
    }
    if (q) {
      where.push(`(sr.full_name LIKE ? OR sr.email LIKE ? OR sr.subject LIKE ?)`);
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT sr.*, u.account_name AS user_account
       FROM support_requests sr
       LEFT JOIN users u ON u.id = sr.user_id
       ${whereSql}
       ORDER BY sr.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) total FROM support_requests sr ${whereSql}`, params
    );

    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/requests/:id (admin) */
export const adminGetSupportRequest = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [[row]] = await pool.query(
      `SELECT sr.*, u.account_name AS user_account
       FROM support_requests sr
       LEFT JOIN users u ON u.id = sr.user_id
       WHERE sr.id = ?`,
      [id]
    );
    if (!row) return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    res.json(row);
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/requests/:id/resolve (admin)
 * body: { status?, admin_note? } 
 * status cho phép: 'dang_xu_ly' | 'da_giai_quyet'
 */
export const adminResolveSupportRequest = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status = 'da_giai_quyet', admin_note = null } = req.body || {};
    if (!['dang_xu_ly', 'da_giai_quyet'].includes(status)) {
      return res.status(400).json({ message: "status không hợp lệ" });
    }

    const resolvedParts = status === 'da_giai_quyet'
      ? `, resolved_at = NOW(), resolved_by = ?`
      : `, resolved_at = NULL, resolved_by = NULL`;

    const [r] = await pool.query(
      `UPDATE support_requests
       SET status = ?, admin_note = ? ${resolvedParts}
       WHERE id = ?`,
      status === 'da_giai_quyet'
        ? [status, admin_note, req.user.id, id]
        : [status, admin_note, id]
    );

    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    }

    const [[row]] = await pool.query(
      `SELECT * FROM support_requests WHERE id=?`, [id]
    );
    res.json(row);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/requests/:id (admin) */
export const adminDeleteSupportRequest = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [r] = await pool.query(`DELETE FROM support_requests WHERE id=?`, [id]);
    if (r.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
