import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");
  if (!accessToken) {
    throw new ApiError(401, "AccessToken is required");
  }
  try {
    const decoded = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!decoded) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = decoded?._id;
    next();
  } catch (error) {
    console.error(error);
    throw new ApiError(401, "Unauthorized request");
  }
});

export { verifyJwt };
