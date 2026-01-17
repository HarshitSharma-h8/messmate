/**
 * Middleware to validate the request using express-validator.
 * 
 * This middleware checks for validation errors in the request object.
 * If validation errors are found, it formats the errors and throws an ApiError
 * with a 400 status code and the validation error details.
 * If no errors are found, it proceeds to the next middleware or route handler.
 * 
 * @function
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * 
 * @throws {ApiError} Throws an error with status code 400 if validation fails.
 */
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";


const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));

    throw new ApiError(400, "Validation failed", formattedErrors);
  }

  next();
};

export default validate;
