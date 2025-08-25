import { Request, Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import * as ProfileModel from "@app/Models/userProfile";
import { Profile } from "@app/Utils/Types/profileType";

// CREATE PROFILE 
export const createProfile = asyncHandler(async (req: Request, res: Response) => {
  const { user_id, bio, skills, startup_idea, stage } = req.body;

  if (!user_id) {
    res.status(400).json({ message: "user_id is required" });
    return;
  }

  const profile = await ProfileModel.createProfile({
    user_id,
    bio,
    skills,
    startup_idea,
    stage,
  });

  res.status(201).json(profile);
});

//  GET PROFILE BY USER ID 
export const getProfileByUserId = asyncHandler(async (req: Request, res: Response) => {
  const { user_id } = req.params;

  const profile = await ProfileModel.getProfileByUserId(user_id);

  if (!profile) {
    res.status(404).json({ message: "Profile not found" });
    return;
  }

  res.status(200).json(profile);
});

//  UPDATE PROFILE 
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const updates = req.body as Partial<Omit<Profile, "id" | "user_id" | "created_at" | "updated_at">>;

  const updatedProfile = await ProfileModel.updateProfile(user_id, updates);

  if (!updatedProfile) {
    res.status(404).json({ message: "Profile not found" });
    return;
  }

  res.status(200).json(updatedProfile);
});

//  DELETE PROFILE 
export const deleteProfile = asyncHandler(async (req: Request, res: Response) => {
  const { user_id } = req.params;

  const deleted = await ProfileModel.deleteProfile(user_id);

  if (!deleted) {
    res.status(404).json({ message: "Profile not found or already deleted" });
    return;
  }

  res.status(200).json({ message: "Profile deleted successfully" });
});
