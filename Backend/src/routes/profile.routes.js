import { Router } from "express";
import { jwtRequireUser } from "../middlewares/authJwt.js";
import { upload } from "../middlewares/upload.js";
import { getMe, updateMe, changePassword } from "../controller/user/profile.controller.js";

const router = Router();

router.get("/me", jwtRequireUser, getMe);

router.put(
  "/me",
  jwtRequireUser,
  upload.fields([{ name: "avatar", maxCount: 1 }]), // avatar là file ảnh
  updateMe
);

router.patch("/me/password", jwtRequireUser, changePassword);

export default router;
