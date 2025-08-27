import { Router } from "express";
import {
  listSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
} from "../controller/admin/songs.controller.js";
import { upload } from "../middlewares/upload.js";
import { jwtRequireUser, jwtTryDecode } from "../middlewares/authJwt.js";

const router = Router();

// GET có thể dùng mine=1 -> cần đọc thử JWT
router.get("/", jwtTryDecode, listSongs);
router.get("/:id", jwtTryDecode, getSongById);

// POST/PUT/DELETE bắt buộc login
router.post(
  "/",
  jwtRequireUser,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "audio", maxCount: 1 }]),
  createSong
);
router.put(
  "/:id",
  jwtRequireUser,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "audio", maxCount: 1 }]),
  updateSong
);
router.delete("/:id", jwtRequireUser, deleteSong);

export default router;