import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

//Get dashboard analytics (ALL ROLES)
router.get("/",protect,authorizeRoles("admin","analyst","viewer"),getDashboard);

export default router;

