import mongoose from "mongoose";
import { USER_ROLE, GENDER, DEGREE } from "../enums/enums.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    registerNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: USER_ROLE,
      default: "STUDENT",
    },

    degree: {
      type: String,
      enum: DEGREE,
    },

    semester: {
      type: Number,
      min: 1,
    },

    gender: {
      type: String,
      enum: GENDER,
      required: true,
    },

    messId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mess",
      required: true,
    },

    otpCode: {
      type: String,
    },

    otpExpiry: {
      type: Date,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpiry: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
