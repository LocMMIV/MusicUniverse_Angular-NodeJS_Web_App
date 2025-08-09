import { Router } from "express";
import {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    lockUser,
    unlockUser,
} from "../controller/admin/users.controller.js";

const router = Router();

// Admin quản lý user
router.get("/", listUsers);                  
router.get("/:id", getUserById);             
router.post("/", createUser);             
router.put("/:id", updateUser);          
router.delete("/:id", deleteUser);           
router.put("/:id/lock", lockUser);           
router.put("/:id/unlock", unlockUser);      

export default router;