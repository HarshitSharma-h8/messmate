import express from "express";
import { createMess } from "../controllers/Mess.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";


const router = express.Router();

router.post("/create", authMiddleware, adminOnly, createMess);

export default router;
