import { Router } from "express";
import { requireUser } from "../middlewares/auth.js";
import {
    listMyFavorites,
    toggleFavorite,
    isFavorite,
    removeFavorite,
} from "../controller/user/favorites.controller.js";

const router = Router();

router.get("/", requireUser, listMyFavorites);
router.post("/:songId", requireUser, toggleFavorite);
router.get("/:songId", requireUser, isFavorite);
router.delete("/:songId", requireUser, removeFavorite);

export default router;
