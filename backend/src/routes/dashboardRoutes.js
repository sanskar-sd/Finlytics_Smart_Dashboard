import express from "express";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { getDashboard } from "../controllers/dashboardController";

const router = express.Router();

//Get dashboard analytics (ALL ROLES)
router.get("/",protect,authorizeRoles("admin","analyst","viewer"),getDashboard);

export default router;

