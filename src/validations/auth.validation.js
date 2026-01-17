import { body } from "express-validator";
import { USER_ROLE, DEGREE, GENDER } from "../enums/enums.js";

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),

  body("registerNumber")
    .trim()
    .notEmpty().withMessage("Register number is required"),

  body("email")
    .isEmail().withMessage("Invalid email address"),

  body("mobile")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(USER_ROLE)
    .withMessage("Invalid role"),

  body("degree")
  .optional()
  .isIn(DEGREE)
  .withMessage("Invalid degree"),

  body("semester")
  .optional()
  .isInt({ min: 1 })
  .withMessage("Invalid semester"),

  body("gender")
    .isIn(GENDER)
    .withMessage("Invalid gender"),

  body("messId")
    .notEmpty()
    .withMessage("Mess is required"),
];

export const loginValidation = [
  body("email")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),
];
