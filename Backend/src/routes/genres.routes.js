import { Router } from "express";
import {
    listGenres,
    getGenreById,
    createGenre,
    updateGenre,
    deleteGenre,
} from "../controller/admin/genres.controller.js";

const router = Router();

// CRUD thể loại
router.get("/", listGenres);
router.get("/:id", getGenreById);
router.post("/", createGenre);
router.put("/:id", updateGenre);
router.delete("/:id", deleteGenre);

export default router;
