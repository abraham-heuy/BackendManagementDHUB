// server.ts (or index.ts)

import { setupAliases } from "import-aliases";
setupAliases();

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {clerkClient, clerkMiddleware} from "@clerk/express"; 
import connect from "./Routes/getConnectionStatus";
import authRoutes from "./Routes/authRoutes";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/userRoutes";
import eventRoutes from "./Routes/eventRoutes";
import profileRoutes from "./Routes/profileRoutes";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Clerk middleware must come BEFORE getAuth or any protected routes
app.use(clerkMiddleware());

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
app.use("/api", connect);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/profile", profileRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello, the API is working. GREAT!!");
});
//testing clerk functionality: status.....(WORKING!!)
app.get("/users", async(req, res)=>{
  const {name} = req.body;
  const {data, totalCount} = await clerkClient.users.getUserList({
    //orderBy: "+created_at"
   // emailAddress: ['enterprisesheuy@gmail.com'],
   //fit up to 100 emails.

   query: name
  });
  res.json({User: data, total: totalCount})
})

// Start the server
app.listen(port, () => {
  console.log("Server is active.");
});
