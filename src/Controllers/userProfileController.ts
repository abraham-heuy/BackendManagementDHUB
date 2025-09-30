// src/controllers/studentProfileController.ts
import { AppDataSource } from "@app/DB/data-source";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { StudentProfile } from "@app/entity/StudentProfile";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { Request, Response } from "express";

export class StudentProfileController {
  private profileRepo = AppDataSource.getRepository(StudentProfile);

  // @desc Get logged-in student's profile
  getMyProfile = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await this.profileRepo.findOne({
      where: { user: { id: req.user.id } },
      relations: ["user"],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(profile);
  });

// @desc Create or update logged-in student's profile
upsertMyProfile = asyncHandler(async (req: UserRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const existingProfile = await this.profileRepo.findOne({
    where: { user: { id: req.user.id } },
    relations: ["user"],
  });

  if (!existingProfile) {
    // Create new profile
    const newProfile = this.profileRepo.create({
      ...req.body,
      user: { id: req.user.id },
    });
    const saved = await this.profileRepo.save(newProfile);
    return res.status(201).json(saved);
  }

  // Update existing profile
  this.profileRepo.merge(existingProfile, req.body);
  const saved = await this.profileRepo.save(existingProfile);
  return res.status(200).json(saved);
});


  // @desc Get a student's profile by userId (admin/mentor only)
  getProfileByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(profile);
  });

  // @desc List all profiles (for admin dashboard)
  listProfiles = asyncHandler(async (_req: Request, res: Response) => {
    const profiles: StudentProfile[] = await this.profileRepo.find({
      relations: ["user"],
    });

    return res.json(profiles);
  });
}
