import Mess from "../models/Mess.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";


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
