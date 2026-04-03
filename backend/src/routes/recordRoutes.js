import express from "express";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { addRecord, editRecord, removeRecord } from "../controllers/recordController";
import { protect } from "../middleware/authMiddleware";
import { getRecords } from "../services/recordService";


const router = express.Router();

//Create record (admin only)
router.post("/",protect,authorizeRoles("admin"),addRecord);

//Get record (admin + analyst)
router.get("/",protect,authorizeRoles("admin","analyst"),getRecords);

//Update Records (admin only)
router.put("/:id",protect,authorizeRoles("admin"),editRecord);

//Delete Record (admin only)
router.delete("/:id",protect,authorizeRoles("admin"),removeRecord);

export default router;