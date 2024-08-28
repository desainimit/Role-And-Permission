import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";

const removeAccessToken = asyncHandler(async (model, userId) => {
  const updatedToken = await model.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  if (!updatedToken) {
    throw new ApiError(500, "Something went wrong while logging out");
  }

  return updatedToken;
});


export { removeAccessToken };