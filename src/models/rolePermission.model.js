import mongoose, { Schema } from "mongoose";

const rolePermissionSchema = new Schema(
  {
    role_id: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    permission_id: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  },
  { timestamps: true }
);

export const RolePermission = mongoose.model(
  "RolePermission",
  rolePermissionSchema
);
