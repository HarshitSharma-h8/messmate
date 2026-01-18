import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    status: {
      type: String,
      enum: ["UNUSED", "USED", "EXPIRED"],
      default: "UNUSED",
    },

    expiresAt: {
      type: Date, // when event ends
    },
  },
  { timestamps: true }
);

/*
 Rule (enforced later in logic):
 - One token per user per event
*/

const Token = mongoose.model("Token", tokenSchema);
export default Token;