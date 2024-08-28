import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { seedRole } from "./role.seeder.js";
import { seedAdmin } from "./admin.seeder.js";
import { seedPermission } from "./permission.seeder.js";
import { seedRolePermission } from "./rolePermission.seeder.js";

const seeders = asyncHandler(async () => {
  try {
    await seedRole();
    await seedPermission();
    await seedRolePermission();
    await seedAdmin();
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { seeders };
