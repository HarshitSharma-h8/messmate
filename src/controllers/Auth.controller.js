import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import generateOTP from "../utils/OtpGenerator.js";
import sendEmail from "../utils/EmailService.js";
import { generateToken } from "../utils/TokenService.js";
import crypto from "crypto";

/**
 * Registers a new user in the system.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing user details.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.registerNumber - The register number of the user.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.mobile - The mobile number of the user.
 * @param {string} req.body.password - The password for the user account.
 * @param {string} req.body.role - The role of the user (e.g., student, admin).
 * @param {string} req.body.degree - The degree program of the user.
 * @param {string} req.body.semester - The semester of the user.
 * @param {string} req.body.gender - The gender of the user.
 * @param {string} req.body.messId - The mess ID associated with the user.
 * @param {Object} res - Express response object.
 * @throws {ApiError} If the user already exists or email sending fails.
 * @returns {void} Sends a success response with OTP information.
 */
export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    registerNumber,
    email,
    mobile,
    password,
    role,
    degree,
    semester,
    gender,
    messId,
    adminSecret, // added
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { registerNumber }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // ---------------- ROLE SECURITY ----------------

  let finalRole; // default safe role

  // Student-specific validation
  if (role === "STUDENT") {
    if (!degree || !semester) {
      throw new ApiError(400, "Degree and semester are required for students");
    }
    finalRole = "STUDENT";
  }

  if (role === "ADMIN") {
    if (!adminSecret) {
      throw new ApiError(403, "Admin secret key required");
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw new ApiError(403, "Invalid admin secret key");
    }

    finalRole = "ADMIN";
  }

  // ------------------------------------------------

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // Send email FIRST
  await sendEmail(
    email,
    "Verify Your Email - Mess Management System",
    `Your OTP is ${otp}. It will expire in 10 minutes.`,
  );

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Hash OTP
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Save user
  await User.create({
    name,
    registerNumber,
    email,
    mobile,
    passwordHash: hashedPassword,
    role: finalRole, // IMPORTANT
    degree,
    semester,
    gender,
    messId,
    otpCode: hashedOtp,
    otpExpiry,
    isVerified: false,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Registration successful. OTP sent to email."));
});

/**
 * Verifies the OTP for email verification.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing verification details.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.otp - The OTP provided by the user.
 * @param {Object} res - Express response object.
 * @throws {ApiError} If the user is not found, already verified, OTP is invalid, or expired.
 * @returns {void} Sends a success response upon successful verification.
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User already verified");
  }

  if (!user.otpCode || !user.otpExpiry) {
    throw new ApiError(400, "OTP not generated");
  }

  if (user.otpExpiry < Date.now()) {
    throw new ApiError(400, "OTP expired");
  }

  // Compare hashed OTP
  const isOtpValid = await bcrypt.compare(otp, user.otpCode);

  if (!isOtpValid) {
    throw new ApiError(400, "Invalid OTP");
  }

  // Mark verified
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpiry = undefined;

  await user.save();

  res.status(200).json(new ApiResponse(200, "Email verified successfully"));
});

/**
 * Logs in a user by validating credentials and generating a JWT token.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing login details.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password for the user account.
 * @param {Object} res - Express response object.
 * @throws {ApiError} If the credentials are invalid or the user is not verified.
 * @returns {void} Sends a success response with the JWT token and user details.
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
    messId: user.messId,
    degree: user.degree,
    semester: user.semester,
  });

  res.status(200).json(
    new ApiResponse(200, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }),
  );
});

/**
 * Logs out a user. For JWT-based authentication, this is a placeholder for future enhancements.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} Sends a success response indicating logout.
 */
export const logoutUser = asyncHandler(async (req, res) => {
  // For JWT, logout is handled client-side by removing token
  // This endpoint exists for consistency and future upgrades (blacklisting)

  res.status(200).json(new ApiResponse(200, "Logout successful"));
});

/**
 * Sends a password reset link to the user's email.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing user details.
 * @param {string} req.body.email - The email address of the user.
 * @param {Object} res - Express response object.
 * @throws {ApiError} If the user is not found or email sending fails.
 * @returns {void} Sends a success response with password reset link information.
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Generate raw token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before saving
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedResetToken;
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  await sendEmail(
    email,
    "Password Reset - Mess Management",
    `Click here to reset your password:\n\n${resetLink}\n\nThis link expires in 15 minutes.`,
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Password reset link sent to email"));
});

/**
 * Resets the user's password using a valid reset token.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing reset details.
 * @param {string} req.body.token - The password reset token.
 * @param {string} req.body.newPassword - The new password for the user account.
 * @param {Object} res - Express response object.
 * @throws {ApiError} If the reset token is invalid or expired.
 * @returns {void} Sends a success response upon successful password reset.
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // Hash incoming token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.passwordHash = hashedPassword;

  // Clear reset fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  res.status(200).json(new ApiResponse(200, "Password reset successful"));
});
