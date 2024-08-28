import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { Admin } from "../models/admin.model.js";
import { Role } from "../models/role.model.js";
import { UserRoles } from "../models/userRoles.model.js";

const seedAdmin = asyncHandler(async () => {
  try {
    const admin = {
      fullName: "Admin",
      username: "admin",
      email: "admin@gmail.com",
      password: "admin@123",
    };

    const existedAdmin = await Admin.findOne({
      $or: [{ username: admin.username }, { email: admin.email }],
    });
    if (existedAdmin) {
      return;
    }

    const newAdmin = await Admin.create(admin);

    const adminRoleId = await Role.findOne({ name: "admin" }).select("_id");
    if (!adminRoleId) {
      throw new ApiError(500, "Admin role not found.");
    }
    const adminRole = await UserRoles.create({
      user_id: newAdmin._id,
      user_type: "admin",
      role_id: adminRoleId,
    });
    if (!adminRole) {
      throw new ApiError(500, "Failed to assign admin role.");
    }
    console.log("Admin seeded successfully");
  } catch (error) {
    throw new ApiError(
      500,
      `Error occurred while seeding admin: ${error.message}`
    );
  }
});

export { seedAdmin };
