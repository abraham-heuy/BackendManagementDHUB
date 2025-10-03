import { StudentStageController } from "@app/Controllers/studentStageController";
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard, studentGuard } from "@app/middlewares/RBAC/roleGuard";
import { Router } from "express";


const router = Router();
const stageController = new StudentStageController();

// =============================
// Student routes
// =============================

// @route GET /api/stages/me/current
// @desc Get my current stage
// @access Private (Student)
router.get(
    "/me/current",
    protect,studentGuard,
    stageController.getMyCurrentStage
);

// @route GET /api/stages/me
// @desc Get all my stages (history + current)
// @access Private (Student)
router.get(
    "/me",studentGuard,
    protect,
    stageController.getMyStages
);

// =============================
// Admin routes
// =============================

// @route GET /api/stages
// @desc List all students with their stages
// @access Private (Admin only)
router.get(
    "/",
    protect,adminGuard,
    stageController.listAllStudentStages
);

// @route POST /api/stages/advance
// @desc Manually advance a student to next stage
// @access Private (Admin only)
router.post(
    "/advance",
    protect, adminGuard, 
    stageController.advanceStudentStage
);

export default router;
