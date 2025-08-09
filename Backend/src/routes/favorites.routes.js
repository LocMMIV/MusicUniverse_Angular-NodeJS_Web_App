import { Router } from "express";
import {
    listFavoritesByUser,
    addFavorite,
    removeFavorite,
} from "../controller/user/favorites.controller.js";

const router = Router();

// Yêu thích
router.get("/:userId", listFavoritesByUser);   
router.post("/", addFavorite);       
router.delete("/:userId/:songId", removeFavorite); 

export default router;
