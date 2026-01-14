import mongoose from "mongoose";
import { MESS_TYPE } from "../enums/enums.js";

const messSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: MESS_TYPE,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Mess = mongoose.model("Mess", messSchema);
export default Mess;
