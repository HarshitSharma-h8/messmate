import MovementLog from "../models/MovementLog.model.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const scanMovement = asyncHandler(async (req, res) => {
  const { reason = "" } = req.body;

  if (!req.user || req.user.role !== "STUDENT") {
    throw new ApiError(403, "Only students can record entry/exit");
  }

  const student = await User.findById(req.user._id).select(
    "name registerNumber degree semester hostelId role"
  );

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (!student.hostelId) {
    throw new ApiError(400, "Student is not assigned to any hostel");
  }

  const lastLog = await MovementLog.findOne({ studentId: student._id }).sort({
    scannedAt: -1,
  });

  // Default: if no previous log, assume student is inside hostel
  // so first movement should be EXIT
  let nextType = "EXIT";

  if (lastLog) {
    nextType = lastLog.type === "EXIT" ? "ENTRY" : "EXIT";
  }

  const log = await MovementLog.create({
    studentId: student._id,
    hostelId: student.hostelId,
    type: nextType,
    reason: reason.trim(),
    scannedAt: new Date(),
    scannedBy: null,
  });

  return res.status(201).json(
    new ApiResponse(201, `${nextType} recorded successfully`, {
      logId: log._id,
      student: {
        _id: student._id,
        name: student.name,
        registerNumber: student.registerNumber,
        degree: student.degree,
        semester: student.semester,
      },
      movement: {
        type: log.type,
        reason: log.reason,
        scannedAt: log.scannedAt,
      },
    })
  );
});

export const getMyMovementHistory = asyncHandler(async (req, res) => {
  const logs = await MovementLog.find({ studentId: req.user._id })
    .sort({ scannedAt: -1 })
    .select("type reason scannedAt createdAt");

  return res
    .status(200)
    .json(new ApiResponse(200, "Movement history fetched successfully", logs));
});

export const getMyCurrentStatus = asyncHandler(async (req, res) => {
  const lastLog = await MovementLog.findOne({ studentId: req.user._id }).sort({
    scannedAt: -1,
  });

  let currentStatus = "INSIDE";

  if (lastLog && lastLog.type === "EXIT") {
    currentStatus = "OUTSIDE";
  }

  return res.status(200).json(
    new ApiResponse(200, "Current hostel status fetched successfully", {
      currentStatus,
      lastMovement: lastLog
        ? {
            type: lastLog.type,
            reason: lastLog.reason,
            scannedAt: lastLog.scannedAt,
          }
        : null,
    })
  );
});

export const getStudentMovementHistory = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    throw new ApiError(400, "studentId is required");
  }

  const student = await User.findById(studentId).select(
    "name registerNumber degree semester hostelId role",
  );

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const logs = await MovementLog.find({ studentId: student._id }).sort({
    scannedAt: -1,
  });

  return res.status(200).json(
    new ApiResponse(200, "Student movement history fetched successfully", {
      student,
      logs,
    }),
  );
});
