import { Router } from "express";
import {
    listSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
} from "../controller/admin/songs.controller.js";

const router = Router();

// CRUD bài hát
router.get("/", listSongs);
router.get("/:id", getSongById);
router.post("/", createSong);
router.put("/:id", updateSong);
router.delete("/:id", deleteSong);

export default router;
