import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());

// Routers imports
import userRouter from "./routes/User/user.routes.js";
import adminRouter from "./routes/Admin/admin.routes.js";

// Routes Declaration

// User Router
app.use("/api/v1/users", userRouter);

// Admin Router
app.use("/api/v1/admin", adminRouter);

export { app };
