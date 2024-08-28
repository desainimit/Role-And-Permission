import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { UserRoles } from "../models/userRoles.model.js";
import { RolePermission } from "../models/rolePermission.model.js";
import { Role } from "../models/role.model.js";
import mongoose from "mongoose";

const authRole = (role, permission) =>
  asyncHandler(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user);

    const result = await UserRoles.aggregate([
      {
        $match: {
          user_id: userId,
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $unwind: "$role",
      },
      {
        $lookup: {
          from: "rolepermissions",
          localField: "role._id",
          foreignField: "role_id",
          as: "rolePermission",
        },
      },
      {
        $lookup: {
          from: "permissions",
          localField: "rolePermission.permission_id",
          foreignField: "_id",
          as: "permission",
        },
      },
      {
        $unwind: "$permission",
      },
      {
        $group: {
          _id: "$_id",
          role: { $first: "$role" },
          permission: { $push: "$permission.name" },
        },
      },
      {
        $project: {
          "role.name": 1,
          permission: 1,
        },
      },
    ]);

    const user = result[0];

    if (user.role.name !== role) {
      throw new ApiError(403, "Forbidden request");
    }

    if (permission) {
      if (!user.permission.includes(permission)) {
        throw new ApiError(403, "You don't have permission");
      }
    }
    next();
  });

export { authRole };
