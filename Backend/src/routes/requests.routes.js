import { Router } from "express";
import { requireUser, requireAdmin } from "../middlewares/auth.js";

// user controllers
import {
  createSupportRequest,
  listMySupportRequests,
} from "../controller/user/requests.controller.js";

// admin controllers
import {
  adminListSupportRequests,
  adminGetSupportRequest,
  adminResolveSupportRequest,
  adminDeleteSupportRequest,
} from "../controller/admin/requests.controller.js";

const router = Router();

/* USER */
router.post("/", requireUser, createSupportRequest);
router.get("/my", requireUser, listMySupportRequests);

/* ADMIN */
router.get("/", requireUser, requireAdmin, adminListSupportRequests);   
router.get("/:id", requireUser, requireAdmin, adminGetSupportRequest);
router.patch("/:id/resolve", requireUser, requireAdmin, adminResolveSupportRequest);
router.delete("/:id", requireUser, requireAdmin, adminDeleteSupportRequest);

export default router;
