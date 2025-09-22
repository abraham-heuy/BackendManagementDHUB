// src/controllers/StageController.ts
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { Response } from "express";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { AppDataSource } from "@app/DB/data-source";
import { User } from "@app/entity/User";
import { ProgressLog } from "@app/entity/ProcessLog";
import { Stage } from "@app/entity/stage";

export class StageController {
  private userRepository = AppDataSource.getRepository(User);
  private progressRepository = AppDataSource.getRepository(ProgressLog);

  // ✅ Promote student to next stage
  promoteStage = asyncHandler(async (req: UserRequest, res: Response) => {
    const { studentId } = req.params;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const student = await this.userRepository.findOne({
      where: { id: studentId },
      relations: ["progressLogs", "role"],
    });

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.role.name !== "student")
      return res.status(400).json({ message: "Only students can have stages" });

    const stages = Object.values(Stage);
    const currentIndex = stages.indexOf(student.stage as Stage);

    if (currentIndex === -1 || currentIndex === stages.length - 1) {
      return res.status(400).json({ message: "Student is already at the final stage" });
    }

    const oldStage = student.stage;
    const newStage = stages[currentIndex + 1] as Stage;

    student.stage = newStage;
    await this.userRepository.save(student);

    const log = this.progressRepository.create({
      student: { id: student.id } as User,
      old_stage: oldStage,
      new_stage: newStage,
      updated_by: { id: req.user.id } as User,
      progressPercent: 0, // default when only stage changes
    });
    await this.progressRepository.save(log);

    res.status(200).json({
      message: `Student promoted from ${oldStage} to ${newStage}`,
      student: { id: student.id, fullName: student.fullName, stage: student.stage },
      log,
    });
  });

  // ✅ Update student progress (without stage change)
  updateProgress = asyncHandler(async (req: UserRequest, res: Response) => {
    const { studentId } = req.params;
    const { progressPercent, milestone, notes } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const student = await this.userRepository.findOne({
      where: { id: studentId },
      relations: ["role"],
    });

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.role.name !== "student")
      return res.status(400).json({ message: "Only students can have progress tracked" });

    const log = this.progressRepository.create({
      student: { id: student.id } as User,
      old_stage: student.stage,
      new_stage: student.stage!, // no stage change
      updated_by: { id: req.user.id } as User,
      progressPercent,
      milestone,
      notes,
    });
    await this.progressRepository.save(log);

    res.status(200).json({
      message: "Progress updated successfully",
      log,
    });
  });

  // ✅ Get current stage of a student
  getStudentStage = asyncHandler(async (req: UserRequest, res: Response) => {
    const { studentId } = req.params;

    const student = await this.userRepository.findOne({
      where: { id: studentId },
      relations: ["role"],
    });

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.role.name !== "student")
      return res.status(400).json({ message: "Only students have stages" });

    res.status(200).json({
      message: "Student stage fetched successfully",
      stage: student.stage,
    });
  });

  // ✅ Get full progress log of a student
  getStudentProgress = asyncHandler(async (req: UserRequest, res: Response) => {
    const { studentId } = req.params;

    const logs = await this.progressRepository.find({
      where: { student: { id: studentId } },
      relations: ["updated_by"],
      order: { updated_at: "DESC" },
    });

    if (!logs || logs.length === 0)
      return res.status(404).json({ message: "No progress logs found for this student" });

    res.status(200).json({
      message: "Progress logs fetched successfully",
      logs,
    });
  });
}
