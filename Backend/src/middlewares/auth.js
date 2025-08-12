// src/middlewares/auth.js

// Lấy user từ headers đơn giản để test API.
// Thực tế có thể thay bằng JWT hoặc session.
export const requireUser = (req, res, next) => {
  const id = Number(req.header('x-user-id'));
  if (!id) {
    return res.status(401).json({ message: 'Unauthorized: missing x-user-id' });
  }
  // Header tùy chọn để test quyền admin/user
  const role = (req.header('x-role') || 'user').toLowerCase();
  req.user = { id, role };
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admin only' });
  }
  next();
};
