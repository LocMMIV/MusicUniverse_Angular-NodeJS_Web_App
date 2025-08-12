import { Router } from "express";
import {
    listSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
} from "../controller/admin/songs.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// CRUD bài hát
router.get("/", listSongs);
router.get("/:id", getSongById);
router.post( "/", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), createSong);
router.put( "/:id", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
]), updateSong);
router.delete("/:id", deleteSong);

export default router;
