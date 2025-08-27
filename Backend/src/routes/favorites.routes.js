import { Router } from "express";
import { jwtRequireUser } from "../middlewares/authJwt.js";

import {
    listMyFavorites,
    toggleFavorite,
    isFavorite,
    removeFavorite,
} from "../controller/user/favorites.controller.js";

const router = Router();

router.get("/",      jwtRequireUser, listMyFavorites);
router.post("/:songId", jwtRequireUser, toggleFavorite);
router.get("/:songId",  jwtRequireUser, isFavorite);
router.delete("/:songId", jwtRequireUser, removeFavorite);

export default router;