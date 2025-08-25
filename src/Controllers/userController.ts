import { Request, Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "@app/Models/userModel";

//  Get all users with roles & permissions
export const fetchUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await getAllUsers();
  res.json({ success: true, users });
});

//  Get single user by ID
export const fetchUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserById(Number(id));

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, user });
});

// Update user info (e.g. name, email)
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fullName, email } = req.body;

  const updatedUser = await updateUser(Number(id), fullName, email );
  res.json({ success: true, user: updatedUser });
});

// Delete user
export const removeUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteUser(Number(id));
  res.json({ success: true, message: "User deleted successfully" });
});

// // ✅ Assign role to user
// export const addRoleToUser = asyncHandler(async (req: Request, res: Response) => {
//   const { userId, roleId } = req.body;
//   const updatedUser = await assignRoleToUser(userId, roleId);
//   res.json({ success: true, user: updatedUser });
// });
