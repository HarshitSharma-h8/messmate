import Mess from "../models/Mess.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";



/**
 * @function createMess
 * @description Controller to create a new mess. Validates if a mess with the same name already exists.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing mess details.
 * @param {string} req.body.name - The name of the mess.
 * @param {string} req.body.type - The type of the mess.
 * @param {Object} res - Express response object.
 * @throws {ApiError} If a mess with the same name already exists.
 * @returns {void} Sends a JSON response with the created mess details.
 */
export const createMess = asyncHandler(async (req, res) => {

  const { name, type } = req.body;

  const existingMess = await Mess.findOne({ name });

  if (existingMess) {
    throw new ApiError(400, "Mess already exists");
  }

  const mess = await Mess.create({
    name,
    type,
  });

  res.status(201).json(
    new ApiResponse(201, "Mess created successfully", mess)
  );
});

