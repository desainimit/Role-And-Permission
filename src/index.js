import dotenv from "dotenv";

import connectDB from "./db/dbConnect.js";
import { app } from "./app.js";
import { connectCloudinary } from "./utils/cloudinary.js";

// Configuration

dotenv.config();

// configure Cloudinary
connectCloudinary();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => console.error("MongoDB connection Failed:", error));
