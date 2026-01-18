import Event from "../models/Event.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import checkAndExpireEvent from "../utils/EventExpiryChecker.js";






/**
 * @function createEvent
 * @description Creates a new event for the mess. Validates input data, checks for active events, and ensures slot timings are valid.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing event details.
 * @param {string} req.body.title - Title of the event.
 * @param {string} req.body.startTime - Start time of the event in ISO format.
 * @param {string} req.body.endTime - End time of the event in ISO format.
 * @param {Array} req.body.slots - Array of slots for the event.
 * @param {Object} req.user - User object attached to the request.
 * @param {string} req.user.messId - Mess ID associated with the user.
 * @param {Object} res - Express response object.
 * @throws {ApiError} If validation fails or an active event already exists.
 * @returns {void} Sends a JSON response with the created event details.
 */
export const createEvent = asyncHandler(async (req, res) => {

  const { title, startTime, endTime, slots } = req.body;

  const messId = req.user.messId;

  // ---------- Basic Validation ----------

  if (!title || !startTime || !endTime) {
    throw new ApiError(400, "Title, startTime and endTime are required");
  }

  if (new Date(startTime) >= new Date(endTime)) {
    throw new ApiError(400, "End time must be after start time");
  }

  // ---------- Check Active Event ----------

  const activeEvent = await Event.findOne({
    messId,
    status: "ACTIVE",
  });

  if (activeEvent) {
    throw new ApiError(400, "An active event already exists for this mess");
  }

  // ---------- Slot Validation ----------

  if (!slots || !Array.isArray(slots) || slots.length === 0) {
    throw new ApiError(400, "At least one slot is required");
  }

  for (let slot of slots) {

    if (!slot.degree || !slot.startTime || !slot.endTime) {
      throw new ApiError(
        400,
        "Each slot must contain degree, startTime and endTime"
      );
    }

    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);

    // Slot time logic
    if (slotStart >= slotEnd) {
      throw new ApiError(400, "Slot end time must be after start time");
    }

    // Slot must be inside event time window
    if (
      slotStart < new Date(startTime) ||
      slotEnd > new Date(endTime)
    ) {
      throw new ApiError(
        400,
        "Slot time must be inside event time window"
      );
    }
  }

  // ---------- Create Event ----------

  const event = await Event.create({
    title,
    messId,
    startTime,
    endTime,
    slots,
    status: "ACTIVE",
  });

  res.status(201).json(
    new ApiResponse(201, "Event created successfully", event)
  );
});



/**
 * @function getActiveEvent
 * @description Fetches the currently active event for the mess. Automatically expires the event if it has ended.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.user - User object attached to the request.
 * @param {string} req.user.messId - Mess ID associated with the user.
 * @param {Object} res - Express response object.
 * @throws {ApiError} If no active event is found.
 * @returns {void} Sends a JSON response with the active event details.
 */
export const getActiveEvent = asyncHandler(async (req, res) => {

  const messId = req.user.messId;

  let event = await Event.findOne({
    messId,
    status: "ACTIVE",
  });

  // Auto-expire if needed
  event = await checkAndExpireEvent(event);

  if (!event || event.status === "ENDED") {
    throw new ApiError(404, "No active event found");
  }

  res.status(200).json(
    new ApiResponse(200, "Active event fetched", event)
  );
});
