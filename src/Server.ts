// server.ts (or index.ts)
import "reflect-metadata"; 

import { setupAliases } from "import-aliases";
setupAliases();

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {AppDataSource} from "@app/DB/data-source"
import authRoutes from "./Routes/authRoutes";
import cookieParser from "cookie-parser";
import EventRoutes  from "./Routes/eventRoutes";
import userRoutes from "./Routes/userRoutes";
import profileRoutes from "./Routes/profileRoutes";


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
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", EventRoutes);
app.use("/api/v1/profile", profileRoutes);

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