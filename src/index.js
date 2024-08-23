import dotenv from "dotenv";

import connectDB from "./db/dbConnect.js";
import { app } from "./app.js";

// Configuration

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => console.error("MongoDB connection Failed:", error));
