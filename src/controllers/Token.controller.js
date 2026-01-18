import Token from "../models/Token.model.js";
import Event from "../models/Event.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import checkAndExpireEvent from "../utils/EventExpiryChecker.js";
import mongoose from "mongoose";

export const generateToken = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const messId = req.user.messId;
  const userDegree = req.user.degree;
  const userSemester = req.user.semester;

  // ---------- Find Active Event ----------

  let event = await Event.findOne({
    messId,
    status: "ACTIVE",
  });

  event = await checkAndExpireEvent(event);

  if (!event || event.status === "ENDED") {
    throw new ApiError(404, "No active event available");
  }

  const now = new Date();

  // ---------- Slot Matching (NO TIME CHECK HERE) ----------

  const matchingSlot = event.slots.find((slot) => {
    const degreeMatch = slot.degree === userDegree;
    const semesterMatch = !slot.semester || slot.semester === userSemester;

    return degreeMatch && semesterMatch;
  });

  if (!matchingSlot) {
    throw new ApiError(403, "No slot assigned for your class");
  }

  // ---------- Prevent Duplicate Token ----------

  const existingToken = await Token.findOne({
    userId,
    eventId: event._id,
  });

  if (existingToken) {
    throw new ApiError(400, "Token already generated");
  }

  // ---------- Create Token ----------

  const token = await Token.create({
    userId,
    eventId: event._id,
    status: "UNUSED",
    expiresAt: event.endTime,
  });

  res.status(201).json(
    new ApiResponse(201, "Token generated successfully", {
      tokenId: token._id,

      event: {
        title: event.title,
        date: event.startTime,
      },

      slot: {
        startTime: matchingSlot.startTime,
        endTime: matchingSlot.endTime,
      },

      status: "UNUSED",
      generatedAt: token.createdAt,
    }),
  );
});

export const getMyToken = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const messId = req.user.messId;
  const userDegree = req.user.degree;
  const userSemester = req.user.semester;

  // Find active event
  let event = await Event.findOne({
    messId,
    status: "ACTIVE",
  });

  event = await checkAndExpireEvent(event);

  if (!event || event.status === "ENDED") {
    throw new ApiError(404, "No active event found");
  }

  // Find user's token for this event
  const token = await Token.findOne({
    userId,
    eventId: event._id,
  });

  if (!token) {
    throw new ApiError(404, "No token generated yet");
  }

  // Find user's slot again (for UI display)
  const matchingSlot = event.slots.find((slot) => {
    const degreeMatch = slot.degree === userDegree;
    const semesterMatch = !slot.semester || slot.semester === userSemester;

    return degreeMatch && semesterMatch;
  });

  if (!matchingSlot) {
    throw new ApiError(400, "Slot configuration error");
  }

  res.status(200).json(
    new ApiResponse(200, "Token fetched successfully", {
      tokenId: token._id,

      event: {
        title: event.title,
        date: event.startTime,
      },

      slot: {
        startTime: matchingSlot.startTime,
        endTime: matchingSlot.endTime,
      },

      status: token.used ? "USED" : "UNUSED",
      generatedAt: token.createdAt,
    }),
  );
});

export const verifyToken = asyncHandler(async (req, res) => {
  const { tokenId } = req.body;

  const adminMessId = req.user.messId;

  if (!tokenId) {
    throw new ApiError(400, "Token ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(tokenId)) {
    throw new ApiError(400, "Invalid token format");
  }

  // Find token with populated event
  const token = await Token.findById(tokenId).populate("eventId");

  if (!token) {
    throw new ApiError(404, "Token not found");
  }

  // Already used check
  if (token.status === "USED") {
    throw new ApiError(400, "Token already used");
  }

  if (token.status === "EXPIRED") {
    throw new ApiError(400, "Token expired");
  }

  const event = token.eventId;

  // Mess ownership check
  if (event.messId.toString() !== adminMessId) {
    throw new ApiError(403, "Token does not belong to your mess");
  }

  // Event expiry check
  const now = new Date();

  if (event.status === "ENDED" || now >= event.endTime) {
    throw new ApiError(400, "Event already ended");
  }

  // Mark token as used
  token.status = "USED";
  await token.save();

  res.status(200).json(
    new ApiResponse(200, "Token verified successfully", {
      tokenId: token._id,
      eventTitle: event.title,
      entryTime: new Date(),
    }),
  );
});
