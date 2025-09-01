// src/controllers/StudentProfileController.ts
import { Request, Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { AppDataSource } from "@app/DB/data-source";
import { StudentProfile } from "@app/entity/StudentProfile";
import { User } from "@app/entity/User";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";

export class StudentProfileController {
  private profileRepo = AppDataSource.getRepository(StudentProfile);
  private userRepo = AppDataSource.getRepository(User);

  // Create profile - authenticated student creates their own profile
  create = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await this.userRepo.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = await this.profileRepo.findOne({
      where: { user: { id: user.id } },
      relations: ["user"],
    });
    if (existing) return res.status(409).json({ message: "Profile already exists" });

    const { bio, skills, startup_idea, stage } = req.body;

    const profile = this.profileRepo.create({
      user,
      bio: bio ?? null,
      skills: Array.isArray(skills) ? skills : skills ? skills.split(",").map((s: string) => s.trim()) : [],
      startup_idea: startup_idea ?? null,
      stage: (stage as any) ?? "pre-incubation",
    });

    const saved = await this.profileRepo.save(profile);
    return res.status(201).json(saved);
  });

  // Get all profiles - public or admin-only (use middleware to protect)
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const profiles = await this.profileRepo.find({ relations: ["user"] });
    return res.status(200).json(profiles);
  });

  // Get profile by profile id (public or admin)
  getOne = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const profile = await this.profileRepo.findOne({ where: { id }, relations: ["user"] });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    return res.status(200).json(profile);
  });

  // Get profile by user id (public or admin)
  getByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const profile = await this.profileRepo.findOne({
      where: { user: { id: user_id } },
      relations: ["user"],
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    return res.status(200).json(profile);
  });

  // Get current authenticated user's profile
  getMine = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const profile = await this.profileRepo.findOne({
      where: { user: { id: req.user.id } },
      relations: ["user"],
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });
    return res.status(200).json(profile);
  });

  // Update profile - student can update own profile; admin can update any
  update = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params; // optional: profile id if admin route
    let profile: StudentProfile | null = null;

    if (req.user.role === "admin" && id) {
      profile = await this.profileRepo.findOne({ where: { id }, relations: ["user"] });
      if (!profile) return res.status(404).json({ message: "Profile not found" });
    } else {
      // normal student updates their own profile
      profile = await this.profileRepo.findOne({
        where: { user: { id: req.user.id } },
        relations: ["user"],
      });
      if (!profile) return res.status(404).json({ message: "Profile not found" });
    }

    const { bio, skills, startup_idea, stage } = req.body;
    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : skills.split(",").map((s: string) => s.trim());
    if (startup_idea !== undefined) profile.startup_idea = startup_idea;
    if (stage !== undefined) profile.stage = stage;

    const updated = await this.profileRepo.save(profile);
    return res.status(200).json(updated);
  });

  // Delete profile - student can delete own profile; admin can delete any
  delete = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    let profile: StudentProfile | null = null;

    if (req.user.role === "admin" && id) {
      profile = await this.profileRepo.findOne({ where: { id }, relations: ["user"] });
    } else {
      profile = await this.profileRepo.findOne({
        where: { user: { id: req.user.id } },
        relations: ["user"],
      });
    }

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    await this.profileRepo.remove(profile);
    return res.status(200).json({ message: "Profile deleted successfully" });
  });
}
