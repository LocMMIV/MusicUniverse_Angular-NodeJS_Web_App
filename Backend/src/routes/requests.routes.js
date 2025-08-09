import { Router } from "express";
import {
    createRequest,
    listRequests,
    getRequestById,
    confirmRequest,
    resolveRequest,
    deleteRequest,
} from "../controller/admin/requests.controller.js";

const router = Router();

// CRUD liên hệ/hỗ trợ
router.post("/", createRequest);                 
router.get("/", listRequests);              
router.get("/:id", getRequestById);           
router.put("/:id/confirm", confirmRequest);  
router.put("/:id/resolve", resolveRequest);    
router.delete("/:id", deleteRequest);          

export default router;
