import mongoose from "mongoose";

const movementLogSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },

    type: {
      type: String,
      enum: ["ENTRY", "EXIT"],
      required: true,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },

    scannedAt: {
      type: Date,
      default: Date.now,
    },

    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin / guard
      default: null,
    },
  },
  { timestamps: true }
);

const MovementLog = mongoose.model("MovementLog", movementLogSchema);
export default MovementLog;