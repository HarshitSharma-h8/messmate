import express from "express";
import { registerUser, verifyOtp, loginUser,logoutUser, forgotPassword, resetPassword } from "../controllers/Auth.controller.js";
import { registerValidation, loginValidation } from "../validations/auth.validation.js";
import validate from "../middlewares/validate.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/register", registerValidation, validate, registerUser);

router.post("/verify-otp", verifyOtp);

router.post("/login", loginValidation, validate, loginUser);

router.post("/logout", authMiddleware, logoutUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
