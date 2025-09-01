import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "@app/DB/data-source";
import { User } from "@app/entity/User";

export const protect = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Look for Bearer token
  const authHeader = req.headers["authorization"];
  if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  // Or fallback to cookies
  if (!token && req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

    // Get user with their role(s)
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: decoded.userId },
      relations: ["userRoles", "userRoles.role"], // load roles
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Assume single role for now
    const role = user.userRoles[0]?.role?.name || "student";

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role,
      permissions: [], // not now, later

    };

    next();
  } catch (err) {
    console.error("❌ JWT Error:", err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});
