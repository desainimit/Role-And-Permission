import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decoded = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!decoded) {
      throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
