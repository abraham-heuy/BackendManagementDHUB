import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { NextFunction, Request, Response} from "express";
import pool from "@app/DB/db";
import jwt  from "jsonwebtoken";
//check first if a user is logged in?


export const protect = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

 const authHeader = req.headers["authorization"]; // lowercase!
if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer")) {
  token = authHeader.split(" ")[1];
}


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

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

    const userQuery = await pool.query(
      `
      SELECT u.id, u.email, u.full_name, r.name as role
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
      `,
      [decoded.userId]
    );

    if (userQuery.rows.length === 0) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const user = userQuery.rows[0];

    const permsQuery = await pool.query(
      `
      SELECT p.action || ':' || p.resource AS permission
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      JOIN roles r ON rp.role_id = r.id
      WHERE r.name = $1
      `,
      [user.role]
    );

    const permissions = permsQuery.rows.map((row) => row.permission);

    req.user = {
      clerkId: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      permissions,
    };

    next();
  } catch (err) {
    console.error("❌ JWT Error:", err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});
