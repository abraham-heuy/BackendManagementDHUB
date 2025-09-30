// src/controllers/studentStageController.ts
import { AppDataSource } from "@app/DB/data-source";
import { StudentStage, StudentStageStatus } from "@app/entity/StudentStage";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { Response } from "express";
import { User } from "@app/entity/User";
import { Stage } from "@app/entity/stage";

export class StudentStageController {
  private studentStageRepo = AppDataSource.getRepository(StudentStage);
  private userRepo = AppDataSource.getRepository(User);

  // =============================
  // Student Endpoints
  // =============================

  // @desc Get my current stage
  getMyCurrentStage = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const currentStage = await this.studentStageRepo.findOne({
      where: { student: { id: req.user.id } },
      order: { started_at: "DESC" },
      relations: ["activities"],
    });

    if (!currentStage) {
      return res
        .status(404)
        .json({ message: "No stage record found for this student" });
    }

    res.json(currentStage);
  });

  // @desc Get all my stages (history + current)
  getMyStages = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const stages = await this.studentStageRepo.find({
      where: { student: { id: req.user.id } },
      order: { started_at: "ASC" },
      relations: ["activities"],
    });

    res.json(stages);
  });

  // =============================
  // Admin Endpoints
  // =============================

  // @desc Admin: list all students with their stages
  listAllStudentStages = asyncHandler(async (_req: UserRequest, res: Response) => {
    const studentStages = await this.studentStageRepo.find({
      relations: ["student", "activities"],
      order: { started_at: "ASC" },
    });

    res.json(studentStages);
  });

  // @desc Admin: manually advance a student to next stage
  advanceStudentStage = asyncHandler(async (req: UserRequest, res: Response) => {
    const { studentId, newStage } = req.body;

    // 1. Find the student
    const student = await this.userRepo.findOne({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. Find current active stage
    const currentStage = await this.studentStageRepo.findOne({
      where: {
        student: { id: studentId },
        status: StudentStageStatus.IN_PROGRESS,
      },
      relations: ["student"],
    });

    // 3. Close the old stage
    if (currentStage) {
      currentStage.status = StudentStageStatus.COMPLETED;
      currentStage.completed_at = new Date();
      await this.studentStageRepo.save(currentStage);
    }

    // 4. Create a new stage record
    const newStudentStage = this.studentStageRepo.create({
      student,
      stage: newStage as Stage,
      status: StudentStageStatus.IN_PROGRESS,
      progressPercent: 0,
    });

    await this.studentStageRepo.save(newStudentStage);

    // 5. Update student’s current stage
    student.stage = newStage as Stage;
    await this.userRepo.save(student);

    res.json({
      message: `Student advanced to ${newStage}`,
      newStage: newStudentStage,
    });
  });
}
