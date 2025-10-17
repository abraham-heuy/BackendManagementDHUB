// server.ts (or index.ts)
import "reflect-metadata"; 

import { setupAliases } from "import-aliases";
setupAliases();

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {AppDataSource} from "@app/DB/data-source"
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/authRoutes";
import userRoutes from "./modules/users/userRoutes";
import EventRoutes from "./modules/events/eventRoutes";
import applicationsRoute from "./modules/events/applicationsRoute";
import profileRoutes from "./modules/users/profileRoutes";
import notificationRoutes from "./modules/notifications/notificationRoutes";
import MentorProfileRoutes from "./modules/users/mentorRoutes";
import analyticsRoutes from "./modules/Analytics/analyticsRoutes";
import reportRoutes from "./modules/Analytics/reportRoutes";
import pitchApplicationRoutes from "./modules/pitchApplication/pitchApplicationRoutes";
import startupRoutes from "./modules/startup/startupRoutes";
import { StageRoutes } from "./modules/acitivities/activityRoutes";



// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", EventRoutes);
app.use("/api/v1/applications", applicationsRoute)
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/notifications", notificationRoutes)
app.use("/api/v1/mentor", MentorProfileRoutes)
app.use("/api/v1/analytics", analyticsRoutes)
app.use("/api/v1/reports", reportRoutes)
app.use("api/v1/pitch", pitchApplicationRoutes)
app.use("/api/v1/startup", startupRoutes)
app.use("/api/v1/activities", new StageRoutes().router)

// Test route
app.get("/", (req, res) => {
  res.send("Hello, the API is working. GREAT!!");
});

// Start the server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully with TypeORM!");
    // start your server only after DB connection
    app.listen(port, () => console.log(`Server running on port:${port}`));
  })
  .catch((error: unknown) => console.error("Database connection failed:", error));