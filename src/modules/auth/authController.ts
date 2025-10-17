import { Request, Response } from "express";
import { AppDataSource } from "@app/DB/data-source";
import { User } from "@app/entity/User";
import { Role } from "@app/entity/Role";
import bcrypt from "bcryptjs";
import { generateToken } from "@app/Utils/Helpers/generateToken";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { Stage } from "@app/entity/stage";
import { Startup } from "@app/entity/startup";

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);
  private roleRepository = AppDataSource.getRepository(Role);
  private stageRepository = AppDataSource.getRepository(Stage);

  /**
   * ✅ Admin registers a new user
   * Password is auto-generated from email + @Desic123
   */
  register = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No admin user found!" });
      }
  
      const { fullName, email, roleName, regNumber, stageId } = req.body;
  
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      // Validate role
      const role = await this.roleRepository.findOne({ where: { name: roleName } });
      if (!role) return res.status(400).json({ message: "Invalid role name" });
  
      // Determine stage for mentee
      let stage: Stage | null = null;
      if (stageId) {
        stage = await this.stageRepository.findOne({ where: { stage_id: stageId }, relations: ["substages"] });
        if (!stage) return res.status(400).json({ message: "Invalid stage ID" });
      }
      // Pick first stage if not provided
      if (!stage && roleName === "mentee") {
        stage = await this.stageRepository.findOne({
          order: { order: 1 },
          relations: ["substages"],
        });
        if (!stage) return res.status(500).json({ message: "No stage found to assign to mentee" });
      }
  
      // Generate and hash password
      const generatedPassword = `${email.split("@")[0]}@Desic123`;
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  
      // Create user
      const user = this.userRepository.create({
        fullName,
        email,
        password: hashedPassword,
        regNumber,
        role,
        ...(roleName === "mentee" && stage ? { stage } : {}),
      });
      await this.userRepository.save(user);
  
      // Create startup if mentee
      if (roleName === "mentee" && stage) {
        const firstSubstage = stage.substages?.[0] || undefined;
  
        const startupRepo = AppDataSource.getRepository(Startup);
        const startup = startupRepo.create({
          title: `${fullName}'s Startup`,
          description: "Initial description", // required
          founder: user,
          currentStage: stage,          // guaranteed Stage
          currentSubStage: firstSubstage, // can be undefined
          cumulativeScore: 0,
          status: "active",
          teamMembers: [],
        });
  
        await startupRepo.save(startup);
      }
  
      return res.status(201).json({
        message: "User registered successfully by admin",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          regNumber: user.regNumber,
          role: role.name,
          stage: stage?.name || null,
          generatedPassword, // admin can share
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  
  

  /**
   * ✅ Login
   */
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findOne({
        where: { email },
        relations: ["role"],
      });

      if (!user) return res.status(401).json({ message: "Invalid email or password" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ message: "Invalid email or password" });

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

  /**
   * ✅ Logout
   */
  logout = async (_req: Request, res: Response): Promise<Response> => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Logged out successfully" });
  };

  /**
   * ✅ Get logged-in user
   */
  getMe = async (req: UserRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    return res.status(200).json({
      id: req.user.id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    });
  };

  /**
   * ✅ Forgot password
   */
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
