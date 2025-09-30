// src/routes/studentProfileRoutes.ts
import { StudentProfileController } from "@app/Controllers/userProfileController";
import { protect } from "@app/middlewares/RBAC/protect";
import { Router } from "express";


const router = Router();
const controller = new StudentProfileController();

// Student routes
router.get("/me", protect, controller.getMyProfile);
router.post("/me", protect, controller.upsertMyProfile);

// Admin/Mentor routes
router.get("/:userId", protect, controller.getProfileByUserId);

export default router;
