import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

//Register Admin
//only used once to create first admin + organization
router.post("/register",register);

//Login (all users)
router.post("/login",login);

export default router;