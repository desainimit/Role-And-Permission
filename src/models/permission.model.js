import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Permission = mongoose.model("Permission", permissionSchema);
