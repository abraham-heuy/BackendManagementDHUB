// src/routes/studentActivityRoutes.ts
import { StudentActivityController } from "@app/Controllers/studentActivityController";
import { protect } from "@app/middlewares/RBAC/protect";
import { Router } from "express";

const router = Router();
const controller = new StudentActivityController();

// Student Routes
router.get(
  "/stages/:stageId/activities",
  protect,
  controller.getStageActivities
);
router.post(
  "/activities/:id/complete",
  protect,
  controller.completeActivity
);

// Admin Routes
router.get(
  "/admin/students/:studentId/stages/:stageId/activities",
  protect,

  controller.getStudentActivities
);

export default router;
