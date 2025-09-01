// src/controllers/AuthController.ts
import { Request, Response } from "express";
import { AppDataSource } from "@app/DB/data-source";
import { User } from "@app/entity/User";
import { Role } from "@app/entity/Role";
import { UserRole } from "@app/entity/UserRole";
import bcrypt from "bcryptjs";
import { generateToken } from "@app/Utils/Helpers/generateToken";

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);
  private roleRepository = AppDataSource.getRepository(Role);
  private userRoleRepository = AppDataSource.getRepository(UserRole);

  // Student Registration (role always student)
  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { fullName, email, password } = req.body;

      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepository.create({
        fullName,
        email,
        password: hashedPassword,
      });

      await this.userRepository.save(user);

      // Always assign "student" role on registration
      const studentRole = await this.roleRepository.findOne({ where: { name: "student" } });
      if (!studentRole) {
        return res.status(500).json({ message: "Default role 'student' not found in database" });
      }

      const userRole = this.userRoleRepository.create({
        user,
        role: studentRole,
      });
      await this.userRoleRepository.save(userRole);

      // ✅ pass role.name instead of id
      const tokens = generateToken(res, user.id, studentRole.name);

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: studentRole.name,
        },
        ...tokens,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Login (students + admins)
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findOne({
        where: { email },
        relations: ["userRoles", "userRoles.role"], // fetch roles
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // For now take the first role (you can extend this later)
      const role = user.userRoles[0]?.role;

      // ✅ pass role.name (string)
      const tokens = generateToken(res, user.id, role?.name || "unknown");

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: role?.name || "unknown",
        },
        ...tokens,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Logout (clear cookies)
  logout = async (_req: Request, res: Response): Promise<Response> => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Logged out successfully" });
  };
}
