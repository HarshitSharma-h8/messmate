import express from "express";
import { generateToken, verifyToken, getMyToken } from "../controllers/Token.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

// Student
router.post("/generate", authMiddleware, generateToken);

// Admin
router.post("/verify", authMiddleware, adminOnly, verifyToken);

router.get("/my", authMiddleware, getMyToken);

export default router;
