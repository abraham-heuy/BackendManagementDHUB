import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticatedUser, UserRequest } from "@app/Utils/Types/authenticatedUser";
import { NextFunction, Response} from "express";

dotenv.config();

export const verifyPermissionJwt = (req:UserRequest, res:Response, next:NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
   if (!jwtSecret) {
    throw new Error("Secret is undefined: please check configuration!!");
  }

   try {
    // explicitly cast decoded type
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Attach decoded token to request
       req.user = decoded as unknown as {
      clerkId: string;
      email: string;
      fullName: string;
      role: string;
      permissions: string[];
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
