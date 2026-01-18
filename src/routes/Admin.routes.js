import express from "express";
import { getEventStats, getLiveEntries } from "../controllers/Admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/event-stats", authMiddleware, adminOnly, getEventStats);
router.get("/entries", authMiddleware, adminOnly, getLiveEntries );

export default router;
