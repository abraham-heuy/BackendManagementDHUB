import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        clerkId: string;
        email: string;
        fullName: string;
      };
    }
  }
}
  
export const validateClerkToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid or missing Clerk token" });
    }

    req.user = {
      clerkId: auth.userId,
      email: (auth.sessionClaims?.email as string) || "",
      fullName: (auth.sessionClaims?.full_name as string) || "",
    };

    next();
  } catch (err: any) {
    console.error("Token validation error:", err.message);
    return res.status(401).json({ error: "Unauthorized", details: err.message });
  }
};
