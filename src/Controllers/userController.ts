import { Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { User } from "@app/entity/User";
import { Role } from "@app/entity/Role";
import { AppDataSource } from "@app/DB/data-source";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import bcrypt from "bcryptjs";

export class UserController {
  private userRepo = AppDataSource.getRepository(User);
  private roleRepo = AppDataSource.getRepository(Role);

  // ✅ Get all users with roles
  fetchUsers = asyncHandler(async (_req: UserRequest, res: Response) => {
    const users = await this.userRepo.find({ relations: ["role"] });
    res.json({
      success: true,
      users: users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        regNumber: u.regNumber,
        role: u.role?.name,
      })),
    });
  });

  // ✅ Get user by ID
  fetchUserById = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ["role"],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        regNumber: user.regNumber,
        role: user.role?.name,
      },
    });
  });

  // ✅ Update user (admin or self handled by guards)
  updateUser = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;
    const { fullName, email, password, regNumber, roleName } = req.body;

    const user = await this.userRepo.findOne({
      where: { id },
      relations: ["role"],
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (regNumber) user.regNumber = regNumber;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (roleName) {
      const role = await this.roleRepo.findOne({ where: { name: roleName } });
      if (!role) {
        return res.status(400).json({ success: false, message: "Invalid role name" });
      }
      user.role = role;
    }

    const updatedUser = await this.userRepo.save(user);

    res.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        regNumber: updatedUser.regNumber,
        role: updatedUser.role?.name,
      },
    });
  });

  // ✅ Delete user
  removeUser = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await this.userRepo.remove(user);

    res.json({ success: true, message: "User deleted successfully" });
  });
}
