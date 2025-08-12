import { Router } from "express";
import { register, login, me } from "../controller/auth.controller.js";
import { jwtRequireUser } from "../middlewares/authJwt.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", jwtRequireUser, me);

export default router;
