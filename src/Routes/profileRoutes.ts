// src/routes/studentProfileRoutes.ts
import { StudentProfileController } from "@app/Controllers/userProfileController";
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard, studentGuard } from "@app/middlewares/RBAC/roleGuard";
import { Router } from "express";


const router = Router();
const controller = new StudentProfileController();

// Student routes
router.get("/me", 
    protect,studentGuard,
    controller.getMyProfile);

router.post("/me", protect, studentGuard,
    controller.upsertMyProfile);

// Admin/Mentor routes
router.get("/:userId", 
    protect,adminGuard, 
    controller.getProfileByUserId);

    router.get(
        "/",
        protect,
        adminGuard,
        controller.listProfiles
      );
      

export default router;
//protect them with guards for admins not to makeprofiles?  YES!

