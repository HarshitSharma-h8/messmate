import express from "express";
import { createEvent, getActiveEvent } from "../controllers/Event.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, adminOnly, createEvent);

router.get("/active", authMiddleware, getActiveEvent);

export default router;
