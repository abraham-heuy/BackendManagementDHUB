// src/routes/reportsRoutes.ts
import express from "express";
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard } from "@app/middlewares/RBAC/roleGuard";
import { ReportsController } from "./reportController";

const router = express.Router();
const controller = new ReportsController();

router.get("/applications", protect, adminGuard, controller.getApplicationsReport);
router.get("/events", protect, adminGuard, controller.getEventsReport);
// router.get("/progress", protect, adminGuard, controller.getProgressReport);
router.get("/mentors", protect, adminGuard, controller.getMentorReport);

export default router;
