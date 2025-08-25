import { Request, Response } from "express";
import { findOrCreateUserByClerkId, getUserWithRoles } from "@app/Models/userModel";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";

export const loginOrRegisterUser = asyncHandler(async (req: Request, res: Response) => {
  const { clerkId, email, fullName } = req.user!;

  // Ensure the user exists in DB
  const user = await findOrCreateUserByClerkId(clerkId, email, fullName);

  // Fetch roles + permissions for this user
  const profileWithRoles = await getUserWithRoles(user.id);

  res.json({
    success: true,
    user: {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      fullName: user.fullName,
      roles: profileWithRoles.roles,
      permissions: profileWithRoles.permissions,
    },
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const { clerkId } = req.user!;

  // Ensure the user exists in DB
  const dbUser = await findOrCreateUserByClerkId(
    clerkId,
    req.user!.email,
    req.user!.fullName
  );

  // Fetch roles + permissions
  const profile = await getUserWithRoles(dbUser.id);

  res.json({
    success: true,
    user: {
      id: dbUser.id,
      clerkId: dbUser.clerkId,
      email: dbUser.email,
      fullName: dbUser.fullName,
      roles: profile.roles,
      permissions: profile.permissions,
    },
  });
});
