import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { changeRole, changeStatus, createUser, getAllUsers } from "../controllers/userController.js";



const router = express.Router();

//Create new user (admin/analyst,viewer)
router.post("/",protect,authorizeRoles("admin"),createUser);

//Get all users..return all users of same organization
router.get("/",protect,authorizeRoles("admin"),getAllUsers);

//Update user role...viewer->analyst (only by admin)
router.patch("/role",protect,authorizeRoles("admin"),changeRole)

//Activate/Deactivate user (only by admin)
router.patch("/status",protect,authorizeRoles("admin"),changeStatus);

export default router;