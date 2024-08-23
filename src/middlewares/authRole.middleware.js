import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";

const authRole = (role) =>
  asyncHandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }
    if (user?.role !== role) {
      // You can redirect to user page
      // return res.redirect("/api/v1/user");
      throw new ApiError(403, "You are not authorized to access page");
    }
    next();
  });

export { authRole };
