import dotenv from "dotenv";
import connectDB from "./db/dbConnect.js";
import { app } from "./app.js";
import { seeders } from "./seeders/seeders.js";

// Configuration

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
      seeders()
        .then(() => console.log("Seeders run successfully"))
        .catch(console.error);
    });
  })
  .catch((error) => console.error("MongoDB connection Failed:", error));
