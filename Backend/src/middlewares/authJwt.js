import jwt from "jsonwebtoken";

const pickUserPublic = (u) => ({
  id: u.id,
  name: u.name,
  account_name: u.account_name,
  email: u.email,
  role: u.role,
  is_locked: u.is_locked,
  locked_at: u.locked_at,
  created_at: u.created_at,
});

export const signToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );

// YÊU CẦU đăng nhập (JWT)
export const jwtRequireUser = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing Bearer token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// YÊU CẦU admin (JWT)
export const jwtRequireAdmin = (req, res, next) => {
  if (!req.auth) return res.status(401).json({ message: "Unauthorized" });
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};

// tiện: trả user public (dùng ở /me)
export const toPublicUser = pickUserPublic;
