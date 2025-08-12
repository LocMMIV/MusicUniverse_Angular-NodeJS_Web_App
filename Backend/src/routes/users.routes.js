// src/routes/users.routes.js (admin scope)
import { Router } from "express";
import { jwtRequireUser, jwtRequireAdmin } from "../middlewares/authJwt.js";
import {
  adminListUsers,
  adminSetLockUser,
  adminGetUser,
  adminSetRole,
} from "../controller/admin/users.controller.js";

const router = Router();

router.get("/", jwtRequireUser, jwtRequireAdmin, adminListUsers);
router.get("/:id", jwtRequireUser, jwtRequireAdmin, adminGetUser);
router.patch("/:id/lock", jwtRequireUser, jwtRequireAdmin, adminSetLockUser);
router.patch("/:id/role", jwtRequireUser, jwtRequireAdmin, adminSetRole);

export default router;
