import jwt from "jsonwebtoken";

import User from "../modules/auth/auth.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const extractToken = (req) => {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  return req.cookies?.token || bearerToken;
};

export const protect = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw new ApiError(401, "Authentication required.");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired session.");
  }

  const user = await User.findById(decodedToken.userId).select("-password");

  if (!user) {
    throw new ApiError(401, "Admin account no longer exists.");
  }

  req.user = user;
  next();
});

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    next(new ApiError(403, "Admin access only."));
    return;
  }

  next();
};

