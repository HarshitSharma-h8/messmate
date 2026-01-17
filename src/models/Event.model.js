import mongoose from "mongoose";
import { EVENT_STATUS } from "../enums/enums.js";

const slotSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    messId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mess",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ENDED"],
      default: "ACTIVE",
    },

    slots: [slotSchema],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;