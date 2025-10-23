import { AppDataSource } from "@app/DB/data-source";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { MenteeProfile } from "@app/entity/menteeProfile";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { Request, Response } from "express";

export class MenteeProfileController {
  private profileRepo = AppDataSource.getRepository(MenteeProfile);

  getMyProfile = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await this.profileRepo.findOne({
      where: { user: { id: req.user.id } },
      relations: ["user"],
    });

    if (!profile) {
      return res.status(200).json({
        message: "No profile found. Please create your mentee profile.",
        profile: null,
        canCreate: true,
      });
    }

    return res.status(200).json({
      message: "Profile retrieved successfully",
      profile,
    });
  });

  upsertMyProfile = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      category,
      bio,
      skills,
      startup_idea,
      phone,
      institution,
      field,
      course,
      yearOfStudy,
      linkedIn,
      website,
      resumeUrl,
    } = req.body;

    const allowedCategories = ["Student", "Graduate", "Entrepreneur", "Innovator"];
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({ message: `Invalid category: ${category}` });
    }

    let dataToSave: Partial<MenteeProfile> = {
      category,
      bio,
      skills,
      startup_idea,
      phone,
      linkedIn,
      website,
      resumeUrl,
    };

    switch (category) {
      case "Student":
        Object.assign(dataToSave, { institution, course, yearOfStudy, field });
        break;
      case "Graduate":
        Object.assign(dataToSave, { institution, field });
        break;
      case "Entrepreneur":
      case "Innovator":
        Object.assign(dataToSave, { startup_idea, field });
        break;
    }

    const existingProfile = await this.profileRepo.findOne({
      where: { user: { id: req.user.id } },
      relations: ["user"],
    });

    if (!existingProfile) {
      const newProfile = this.profileRepo.create({
        ...dataToSave,
        user: { id: req.user.id },
      });
      const saved = await this.profileRepo.save(newProfile);
      return res.status(201).json({
        message: "Profile created successfully",
        profile: saved,
      });
    }

    this.profileRepo.merge(existingProfile, dataToSave);
    const saved = await this.profileRepo.save(existingProfile);

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: saved,
    });
  });

  getProfileByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json(profile);
  });

  listProfiles = asyncHandler(async (_req: UserRequest, res: Response) => {
    const profiles = await this.profileRepo.find({
      relations: ["user"],
      order: { created_at: "DESC" },
    });

    return res.status(200).json(profiles);
  });
}
