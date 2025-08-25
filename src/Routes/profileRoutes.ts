import { createProfile, deleteProfile, getProfileByUserId, updateProfile } from "@app/Controllers/userProfileController";

import express from "express"


const profile = express.Router()

profile.post("/", createProfile);
profile.get("/:user_id", getProfileByUserId);
profile.put("/:user_id", updateProfile);
profile.delete("/:user_id", deleteProfile);

export default profile;