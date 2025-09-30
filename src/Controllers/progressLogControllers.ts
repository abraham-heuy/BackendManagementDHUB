// src/controllers/progressLogController.ts
import { Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { AppDataSource } from "@app/DB/data-source";
import { User } from "@app/entity/User";
import { ProgressLog } from "@app/entity/ProcessLog";

export class ProgressLogController {
  private progressLogRepo = AppDataSource.getRepository(ProgressLog);
  private userRepo = AppDataSource.getRepository(User);

  // Create a progress log (admin/mentor action)
  createLog = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { studentId, old_stage, new_stage, progressPercent, milestone, notes } = req.body;

      const student = await this.userRepo.findOne({ where: { id: studentId } });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      let updatedBy: User | null = null;
      if (req.user?.id) {
        updatedBy = await this.userRepo.findOne({ where: { id: req.user.id } });
      }

      const log = this.progressLogRepo.create({
        student,
        old_stage,
        new_stage,
        progressPercent: progressPercent ?? 0,
        milestone,
        notes,
        updated_by: updatedBy,
      });

      await this.progressLogRepo.save(log);

      res.status(201).json(log);
    } catch (error) {
      console.error("Error creating progress log:", error);
      res.status(500).json({ message: "Failed to create progress log" });
    }
  });

  // Get logs for a specific student (admins/mentors OR student himself)
  getLogsForStudent = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { studentId } = req.params;

      // Students can only view their own logs
      if (req.user?.role === "student" && req.user.id !== studentId) {
        return res.status(403).json({ message: "Not authorized to view these logs" });
      }

      const logs = await this.progressLogRepo.find({
        where: { student: { id: studentId } },
        relations: ["student", "updated_by"],
        order: { updated_at: "DESC" },
      });

      res.json(logs);
    } catch (error) {
      console.error("Error fetching student logs:", error);
      res.status(500).json({ message: "Failed to fetch student logs" });
    }
  });

  // Get all logs (admin/mentor only)
  getAllLogs = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const logs = await this.progressLogRepo.find({
        relations: ["student", "updated_by"],
        order: { updated_at: "DESC" },
      });

      res.json(logs);
    } catch (error) {
      console.error("Error fetching all logs:", error);
      res.status(500).json({ message: "Failed to fetch all progress logs" });
    }
  });
}
