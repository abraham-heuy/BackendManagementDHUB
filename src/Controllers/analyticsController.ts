// src/Controllers/analyticsController.ts
import { Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { AnalyticsService } from "@app/Services.ts/analyticsService";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  // 📊 Dashboard Summary
  getDashboard = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await analyticsService.getDashboardSummary(req.user.id);
      return res.json({ success: true, data });
    } catch (error: any) {
      console.error("Error fetching dashboard analytics:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // 👥 User Stats
  getUserStats = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const stats = await analyticsService.getUserStats(req.user.id);
      return res.json({ success: true, data: stats });
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // 🎓 Stage Stats
  getStageStats = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const stats = await analyticsService.getStageProgressStats(req.user.id);
      return res.json({ success: true, data: stats });
    } catch (error: any) {
      console.error("Error fetching stage stats:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
