// src/routes/studentActivityRoutes.ts
import { StudentActivityController } from "@app/Controllers/studentActivityController";
import { protect } from "@app/middlewares/RBAC/protect";
import { studentGuard } from "@app/middlewares/RBAC/roleGuard";
import { Router } from "express";

const router = Router();
const controller = new StudentActivityController();

// Student Routes
router.get(
  "/stages/:stageId/activities",
  protect,studentGuard,
  controller.getStageActivities
);
router.post(
  "/activities/:id/complete",
  protect,studentGuard,
  controller.completeActivity
);

// // Admin Routes
// router.get(
//   "/admin/students/:studentId/stages/:stageId/activities",
//   protect,

//   controller.getStudentActivities
// );

export default router;
