import ApiError from "../utils/ApiError.js";

export const adminOnly = (req, res, next) => {

  if (!req.user || req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  next();
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied");
    }
    next();
  };
};
