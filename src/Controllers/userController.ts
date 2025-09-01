import { Request, Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { User } from "@app/entity/User";
import { AppDataSource } from "@app/DB/data-source"; 
import { UserRequest } from "@app/Utils/Types/authenticatedUser";

export class UserController {
  private userRepo = AppDataSource.getRepository(User);

  // ✅ Get all users with roles
  fetchUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userRepo.find();
    res.json({ success: true, users });
  });

  // ✅ Get user by ID
  fetchUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  });

  // ✅ Update user info (name, email)
  updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { fullName, email } = req.body;

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.fullName = fullName ?? user.fullName;
    user.email = email ?? user.email;

    const updatedUser = await this.userRepo.save(user);

    res.json({ success: true, user: updatedUser });
  });

  // ✅ Delete user
  removeUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await this.userRepo.remove(user);

    res.json({ success: true, message: "User deleted successfully" });
  });

}
