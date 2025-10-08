// src/routes/analyticsRoutes.ts
import { AnalyticsController } from "@app/Controllers/analyticsController";
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard } from "@app/middlewares/RBAC/roleGuard";
import express from "express";

const router = express.Router();
const controller = new AnalyticsController();

router.get("/dashboard", protect,adminGuard,controller.getDashboard);
router.get("/users", protect,adminGuard,controller.getUserStats);
router.get("/stages", protect,adminGuard,controller.getStageStats);

export default router;
