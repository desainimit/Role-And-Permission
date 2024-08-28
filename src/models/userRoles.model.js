import mongoose, { Schema } from "mongoose";

const userRolesSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    user_type: {
      type: String,
      required: true,
    },
    role_id: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

export const UserRoles = mongoose.model("UserRoles", userRolesSchema);
