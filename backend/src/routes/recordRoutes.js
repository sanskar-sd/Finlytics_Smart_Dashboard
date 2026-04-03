import express from "express";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { addRecord, editRecord, getALLRecords, removeRecord } from "../controllers/recordController.js";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();

//Create record (admin only)
router.post("/",protect,authorizeRoles("admin"),addRecord);

//Get record (admin + analyst)
router.get("/",protect,authorizeRoles("admin","analyst"),getALLRecords);

//Update Records (admin only)
router.put("/:id",protect,authorizeRoles("admin"),editRecord);

//Delete Record (admin only)
router.delete("/:id",protect,authorizeRoles("admin"),removeRecord);

export default router;