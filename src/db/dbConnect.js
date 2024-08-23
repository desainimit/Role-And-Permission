import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { ApiError } from "../utils/apiError.js";


const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );

    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection Failed:", error);
    throw new ApiError(500, "MongoDB connection Failed");
  }
};

export default connectDB;