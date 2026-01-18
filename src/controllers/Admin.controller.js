import Event from "../models/Event.model.js";
import Token from "../models/Token.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import checkAndExpireEvent from "../utils/EventExpiryChecker.js";

export const getEventStats = asyncHandler(async (req, res) => {

  const messId = req.user.messId;

  // Find active event
  let event = await Event.findOne({
    messId,
    status: "ACTIVE",
  });

  event = await checkAndExpireEvent(event);

  if (!event || event.status === "ENDED") {
    throw new ApiError(404, "No active event found");
  }

  const eventId = event._id;

  // Aggregate token stats
  const totalTokens = await Token.countDocuments({ eventId });

  const usedTokens = await Token.countDocuments({
    eventId,
    status: "USED",
  });

  const unusedTokens = await Token.countDocuments({
    eventId,
    status: "UNUSED",
  });

  const expiredTokens = await Token.countDocuments({
    eventId,
    status: "EXPIRED",
  });

  res.status(200).json(
    new ApiResponse(200, "Event stats fetched successfully", {
      event: {
        id: event._id,
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
      },

      stats: {
        totalTokens,
        usedTokens,
        unusedTokens,
        expiredTokens,
      },
    })
  );
});

export const getLiveEntries = asyncHandler(async (req, res) => {

  const messId = req.user.messId;

  // Find active OR last ended event
  let event = await Event.findOne({
    messId,
    status: "ACTIVE",
  });

  if (!event) {
    event = await Event.findOne({
      messId,
      status: "ENDED",
    }).sort({ endTime: -1 });
  }

  if (!event) {
    throw new ApiError(404, "No event found");
  }

  // Fetch used tokens (entries)
  const entries = await Token.find({
    eventId: event._id,
    status: "USED",
  })
    .populate("userId", "name registerNumber degree semester")
    .sort({ updatedAt: -1 });

  res.status(200).json(
    new ApiResponse(200, "Live entries fetched", {
      event: {
        id: event._id,
        title: event.title,
      },
      totalEntries: entries.length,
      entries: entries.map(token => ({
        tokenId: token._id,
        student: token.userId,
        entryTime: token.updatedAt,
      })),
    })
  );
});

