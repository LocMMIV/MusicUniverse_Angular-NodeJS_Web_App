import multer from "multer";
import fs from "fs";
import path from "path";

// đảm bảo thư mục tồn tại
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAudio = file.mimetype.startsWith("audio/");
    const isImage = file.mimetype.startsWith("image/");
    let folder = "uploads/misc";
    if (isAudio) folder = "uploads/audio";
    if (isImage) folder = (file.fieldname === "avatar") ? "uploads/avatars" : "uploads/images";
    ensureDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh hoặc audio"), false);
  }
};

// giới hạn ~30MB / file
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 },
});

// helper: trả path public để lưu DB (dùng trong controller)
export const filePublicPath = (file) =>
  file ? `/${file.path.replace(/\\/g, "/")}` : null;
