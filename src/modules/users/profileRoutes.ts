// src/routes/studentProfileRoutes.ts
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard, adminorStaffGuard, studentGuard } from "@app/middlewares/RBAC/roleGuard";
import { Router } from "express";
import { MenteeProfileController } from "./userProfileController";


const router = Router();
const controller = new MenteeProfileController();

// Student routes
router.get("/me", 
    protect,studentGuard,
    controller.getMyProfile);

router.post("/me", protect, studentGuard,
    controller.upsertMyProfile);

// Admin/Mentor routes
router.get("/:userId", 
    protect, adminorStaffGuard,  
    controller.getProfileByUserId);

    router.get(
        "/",
        protect,
        adminGuard,
        controller.listProfiles
      );
      

export default router;
//protect them with guards for admins not to makeprofiles?  YES!

