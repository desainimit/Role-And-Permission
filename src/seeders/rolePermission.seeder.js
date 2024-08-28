import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { RolePermission } from "../models/rolePermission.model.js";
import { Role } from "../models/role.model.js";
import { Permission } from "../models/permission.model.js";

const seedRolePermission = asyncHandler(async () => {
  try {
    const roles = await Role.find({}).select("_id name");
    const permissions = await Permission.find({}).select("_id name");

    const adminRole = roles.find((role) => role.name === "admin");
    const userRole = roles.find((role) => role.name === "user");

    const adminPermissions = permissions.map((permission) => {
      return {
        role_id: adminRole._id,
        permission_id: permission._id,
      };
    });

    const userPermissions = permissions
      .map((permission) => {
        if (
          permission.name === "create_inventory" ||
          permission.name === "read_inventory" ||
          permission.name === "update_inventory" ||
          permission.name === "delete_inventory"
        ) {
          return {
            role_id: userRole._id,
            permission_id: permission._id,
          };
        }
        return null;
      })
      .filter((permission) => permission !== null);

    const allPermissions = [...adminPermissions, ...userPermissions];

    const rolePermissions = await RolePermission.insertMany(allPermissions);
    if (!rolePermissions) {
      throw new ApiError(500, "Failed to seed role permission.");
    }
    console.log("Role Permission seeded successfully");
  } catch (error) {
    throw new ApiError(
      500,
      `Error occurred while seeding Role Permission: ${error.message}`
    );
  }
});

export { seedRolePermission };
