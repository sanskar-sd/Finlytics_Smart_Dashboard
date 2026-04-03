import express from "express";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { changeRole, changeStatus, createUser, getAllUsers } from "../controllers/userController";



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