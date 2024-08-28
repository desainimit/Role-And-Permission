import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { Role } from "../models/role.model.js";

const seedRole = asyncHandler(async () => {
  try {
    const roles = [
      {
        name: "user",
        description: "User role",
      },
      {
        name: "admin",
        description: "Admin role",
      },
    ];

    // how to check one by one role if it already exists in the database
    roles.forEach(async (role) => {
      const existedRole = await Role.findOne({ name: role.name });
      if (existedRole) {
        return;
      }
      const newRole = await Role.create(role);
      if (!newRole) {
        throw new ApiError(500, "Something went wrong while seeding role");
      }
    });
    console.log("Roles seeded successfully");
  } catch (error) {
    throw new ApiError(500, `Error occurred while seeding Roles: ${error.message}`);
  }
});

export { seedRole };
