import { Router } from "express";
import {
  getMyCurrentStatus,
  getMyMovementHistory,
  getStudentMovementHistory,
  scanMovement,
} from "../controllers/Movement.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import  authorizeRoles  from "../middlewares/role.middleware.js";

const router = Router();

// Student / gate side scan
router.post("/scan", authMiddleware, authorizeRoles("STUDENT"), scanMovement);

// Student side
router.get("/my-history", authMiddleware, authorizeRoles("STUDENT"), getMyMovementHistory);
router.get("/my-status", authMiddleware, authorizeRoles("STUDENT"), getMyCurrentStatus);

// Admin side - inspect specific student logs
router.get(
  "/student/:studentId",
  verifyJWT,
  authorizeRoles("ADMIN"),
  getStudentMovementHistory
);

export default router;