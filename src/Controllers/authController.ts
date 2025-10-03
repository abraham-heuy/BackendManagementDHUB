import { Request, Response } from "express";
import { AppDataSource } from "@app/DB/data-source";
import { User } from "@app/entity/User";
import { Role } from "@app/entity/Role";
import bcrypt from "bcryptjs";
import { generateToken } from "@app/Utils/Helpers/generateToken";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);
  private roleRepository = AppDataSource.getRepository(Role);

  // ✅ Admin registers a new user

register = async (req: UserRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found!" });
    }
    const { fullName, email, password, roleName, regNumber, stage } = req.body;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate role
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) return res.status(400).json({ message: "Invalid role name" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      fullName,
      email,
      password: hashedPassword,
      regNumber,
      role,
      stage: roleName === "student" ? stage || null : null, // only students have  a stage from our entity(User), umeelewa? 
    });

    await this.userRepository.save(user);

    return res.status(201).json({
      message: "User registered successfully by admin",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        regNumber: user.regNumber,
        role: role.name,
        stage: user.stage,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


  // ✅ Login
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findOne({
        where: { email },
        relations: ["role"], // 👈 fetch role directly
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const tokens = generateToken(res, user.id, user.role?.name || "unknown");

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role?.name,
        },
        ...tokens,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  };

  // ✅ Logout
  logout = async (_req: Request, res: Response): Promise<Response> => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Logged out successfully" });
  };

  // ✅ Get logged-in user
  getMe = async (req: UserRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return 
    }

    res.status(200).json({
      id: req.user.id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    });
  };

  // ✅ Update user (admin or user self)
  updateUser = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { fullName, email, password, roleId, regNumber } = req.body;

      const user = await this.userRepository.findOne({
        where: { id },
        relations: ["role"],
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (regNumber) user.regNumber = regNumber;

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      if (roleId) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) return res.status(400).json({ message: "Invalid role ID" });
        user.role = role;
      }

      await this.userRepository.save(user);

      return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      console.error("Update user error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // ✅ Forgot password (simple version: reset by email)
  forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, newPassword } = req.body;

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}
