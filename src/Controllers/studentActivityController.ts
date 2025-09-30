// src/controllers/studentActivityController.ts
import { AppDataSource } from "@app/DB/data-source";
import { StageActivity } from "@app/entity/StageActivity";
import { StudentActivity, StudentActivityStatus } from "@app/entity/StudentActivity";
import { StudentStage, StudentStageStatus } from "@app/entity/StudentStage";
import { User } from "@app/entity/User";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { Request, Response } from "express";

export class StudentActivityController {
  private stageActivityRepo = AppDataSource.getRepository(StageActivity);
  private studentActivityRepo = AppDataSource.getRepository(StudentActivity);
  private studentStageRepo = AppDataSource.getRepository(StudentStage);
  private userRepo = AppDataSource.getRepository(User);

  // @desc Get all activities for a stage (with my completion status)
  getStageActivities = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { stageId } = req.params;

      // Find student’s stage record
      const studentStage = await this.studentStageRepo.findOne({
        where: { student: { id: req.user.id }, stage: stageId as any },
        relations: ["activities", "activities.activity"],
      });

      if (!studentStage) {
        return res.status(404).json({ message: "No stage record found for this student" });
      }

      // Get all activities for this stage
      const activities = await this.stageActivityRepo.find({
        where: { stage: stageId as any },
        order: { ordering: "ASC" },
      });

      // Merge with student activity progress
      const result = activities.map((activity) => {
        const studentAct = studentStage.activities.find(
          (a) => a.activity.id === activity.id
        );
        return {
          ...activity,
          status: studentAct?.status || StudentActivityStatus.NOT_STARTED,
          score: studentAct?.score || null,
          updated_at: studentAct?.updated_at || null,
        };
      });

      res.json(result);
    } catch (error) {
      console.error("Error fetching stage activities:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

  // @desc Mark an activity complete (student)
  completeActivity = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const { id } = req.params; // activityId
      const { score } = req.body;

      const activity = await this.stageActivityRepo.findOne({ where: { id } });
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      // Find current student stage
      const studentStage = await this.studentStageRepo.findOne({
        where: { student: { id: req.user.id }, stage: activity.stage, status: StudentStageStatus.IN_PROGRESS },
        relations: ["activities", "activities.activity"],
      });

      if (!studentStage) {
        return res.status(400).json({ message: "No active stage found for this student" });
      }

      // Check if activity already exists in studentActivity
      let studentActivity = studentStage.activities.find(
        (a) => a.activity.id === activity.id
      );

      if (!studentActivity) {
        studentActivity = this.studentActivityRepo.create({
          studentStage,
          activity,
          status: StudentActivityStatus.COMPLETED,
          score: score || null,
        });
      } else {
        studentActivity.status = StudentActivityStatus.COMPLETED;
        studentActivity.score = score ?? studentActivity.score;
      }

      await this.studentActivityRepo.save(studentActivity);

      // 🔄 Update stage progress
      const stageActivities = await this.stageActivityRepo.find({
        where: { stage: activity.stage },
      });

      const requiredActivities = stageActivities.filter((a) => a.required);
      const completedRequired = studentStage.activities.filter(
        (a) =>
          a.status === StudentActivityStatus.COMPLETED &&
          requiredActivities.some((ra) => ra.id === a.activity.id)
      );

      const progress =
        requiredActivities.length > 0
          ? Math.round((completedRequired.length / requiredActivities.length) * 100)
          : 100;

      studentStage.progressPercent = progress;

      if (progress === 100) {
        studentStage.status = StudentStageStatus.COMPLETED;
        studentStage.completed_at = new Date();
      }

      await this.studentStageRepo.save(studentStage);

      res.json({
        message: "Activity completed successfully",
        activity: studentActivity,
        progress: studentStage.progressPercent,
      });
    } catch (error) {
      console.error("Error completing activity:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

  // @desc Admin: Get a student’s activities (by stage)
  getStudentActivities = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { studentId, stageId } = req.params;

      const studentStage = await this.studentStageRepo.findOne({
        where: { student: { id: studentId }, stage: stageId as any },
        relations: ["activities", "activities.activity"],
      });

      if (!studentStage) {
        return res.status(404).json({ message: "No stage record found for this student" });
      }

      res.json(studentStage.activities);
    } catch (error) {
      console.error("Error fetching student activities:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
}
