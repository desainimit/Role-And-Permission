import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { Permission } from "../models/permission.model.js";

const seedPermission = asyncHandler(async () => {
  try {
    const permissions = [
      {
        name: "create_user",
        description: "Create a user",
      },
      {
        name: "read_user",
        description: "Read a user",
      },
      {
        name: "update_user",
        description: "Update a user",
      },
      {
        name: "delete_user",
        description: "Delete a user",
      },
      {
        name: "create_admin",
        description: "Create an admin",
      },
      {
        name: "read_admin",
        description: "Read an admin",
      },
      {
        name: "update_admin",
        description: "Update an admin",
      },
      {
        name: "delete_admin",
        description: "Delete an admin",
      },
      {
        name: "create_role",
        description: "Create a role",
      },
      {
        name: "read_role",
        description: "Read a role",
      },
      {
        name: "update_role",
        description: "Update a role",
      },
      {
        name: "delete_role",
        description: "Delete a role",
      },
      {
        name: "create_permission",
        description: "Create a permission",
      },
      {
        name: "read_permission",
        description: "Read a permission",
      },
      {
        name: "update_permission",
        description: "Update a permission",
      },
      {
        name: "delete_permission",
        description: "Delete a permission",
      },
      {
        name: "create_inventory",
        description: "Create an inventory",
      },
      {
        name: "read_inventory",
        description: "Read an inventory",
      },
      {
        name: "update_inventory",
        description: "Update an inventory",
      },
      {
        name: "delete_inventory",
        description: "Delete an inventory",
      },
    ];

    permissions.forEach(async (permission) => {
      const existedPermission = await Permission.findOne({
        name: permission.name,
      });
      if (existedPermission) {
        return;
      }
      const newPermission = await Permission.create(permission);
      if (!newPermission) {
        throw new ApiError(
          500,
          "Something went wrong while creating permissions"
        );
      }
    });
    console.log("Permission seeded successfully");
  } catch (error) {
    throw new ApiError(
      500,
      `Error occurred while seeding Permissions: ${error.message}`
    );
  }
});

export { seedPermission };
