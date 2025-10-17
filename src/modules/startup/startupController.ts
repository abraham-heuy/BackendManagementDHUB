import { Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { AppDataSource } from "@app/DB/data-source";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";

import { Startup } from "@app/entity/startup";
import { SubStage } from "@app/entity/substage";
import { StartupProgress } from "@app/entity/startupActivity";
import { User } from "@app/entity/User";
import { Stage } from "@app/entity/stage";

const startupRepo = AppDataSource.getRepository(Startup);
const subStageRepo = AppDataSource.getRepository(SubStage);
const progressRepo = AppDataSource.getRepository(StartupProgress);
const userRepo = AppDataSource.getRepository(User);
const stageRepo = AppDataSource.getRepository(Stage);

export class StartupProgressController {
  // 1️⃣ List all substages for the mentee
  listMenteeSubstages = asyncHandler(async (req: UserRequest, res: Response) => {
    const mentee = req.user!;
    const startup = await startupRepo.findOne({
      where: { founder: { id: mentee.id } },
      relations: ["currentStage", "currentSubStage", "progressHistory"],
    });

    if (!startup) return res.status(404).json({ message: "Startup not found" });

    const substages = await subStageRepo.find({
      where: { stage: { stage_id: startup.currentStage.stage_id } },
      order: { order: "ASC" },
      relations: ["createdBy"],
    });

    const result = substages.map((sub) => {
      const progress = startup.progressHistory.find((p) => p.subStage.substage_id === sub.substage_id);
      return {
        substage_id: sub.substage_id,
        name: sub.name,
        order: sub.order,
        weightScore: sub.weightScore,
        status: progress?.status || "pending",
        scoreAwarded: progress?.scoreAwarded || 0,
        reviewerComment: progress?.comment || null,
      };
    });

    res.status(200).json(result);
  });

  // 2️⃣ Mentee submits a substage activity
  submitSubstage = asyncHandler(async (req: UserRequest, res: Response) => {
    const mentee = req.user!;
    const { substageId } = req.params;

    const startup = await startupRepo.findOne({
      where: { founder: { id: mentee.id } },
      relations: ["progressHistory", "currentSubStage", "currentStage"],
    });
    if (!startup) return res.status(404).json({ message: "Startup not found" });

    const substage = await subStageRepo.findOne({ where: { substage_id: substageId }, relations: ["createdBy"] });
    if (!substage) return res.status(404).json({ message: "Substage not found" });

    const existingProgress = startup.progressHistory.find((p) => p.subStage.substage_id === substageId);
    if (existingProgress && existingProgress.status === "submitted")
      return res.status(400).json({ message: "Substage already submitted" });

    const creatorEntity = await userRepo.findOne({ where: { id: substage.createdBy.id } });
    if (!creatorEntity) return res.status(404).json({ message: "Creator not found" });

    const progress = progressRepo.create({
      startup,
      subStage: substage,
      reviewedBy: creatorEntity, // alert goes to creator/reviewer
      scoreAwarded: 0,
      status: "submitted",
    });

    await progressRepo.save(progress);

    res.status(201).json({ message: "Substage submitted successfully, awaiting approval", progress });
  });

  // 3️⃣ Reviewer approves/rejects a substage
  reviewSubstage = asyncHandler(async (req: UserRequest, res: Response) => {
    const reviewer = req.user!;
    const { progressId } = req.params;
    const { approve, scoreAwarded, comment } = req.body as { approve: boolean; scoreAwarded: number; comment?: string };

    const progress = await progressRepo.findOne({
      where: { id: progressId },
      relations: ["subStage", "startup"],
    });

    if (!progress) return res.status(404).json({ message: "Progress record not found" });

    const reviewerEntity = await userRepo.findOne({ where: { id: reviewer.id } });
    if (!reviewerEntity) return res.status(404).json({ message: "Reviewer not found" });

    progress.status = approve ? "approved" : "rejected";
    progress.scoreAwarded = approve ? scoreAwarded : 0;
    progress.comment = comment || null;
    progress.reviewedBy = reviewerEntity;

    await progressRepo.save(progress);

    // Update startup cumulative score if approved
    if (approve) {
      const startup = await startupRepo.findOne({
        where: { startup_id: progress.startup.startup_id },
        relations: ["progressHistory"],
      });

      if (startup) {
        const totalScore = startup.progressHistory.reduce(
          (sum, p) => sum + (p.status === "approved" ? p.scoreAwarded : 0),
          0
        );
        startup.cumulativeScore = totalScore;
        await startupRepo.save(startup);
      }
    }

    res.status(200).json({ message: `Substage ${progress.status}`, progress });
  });

  // 4️⃣ Check if mentee can move to next substage or next stage
  checkStageProgression = asyncHandler(async (req: UserRequest, res: Response) => {
    const mentee = req.user!;
    const startup = await startupRepo.findOne({
      where: { founder: { id: mentee.id } },
      relations: ["currentStage", "currentSubStage", "progressHistory", "currentStage.substages"],
    });

    if (!startup) return res.status(404).json({ message: "Startup not found" });

    const currentSubIndex = startup.currentStage.substages.findIndex(
      (sub) => sub.substage_id === startup.currentSubStage?.substage_id
    );

    if (currentSubIndex === -1) return res.status(400).json({ message: "Current substage not found in stage" });

    const currentProgress = startup.progressHistory.find(
      (p) => p.subStage.substage_id === startup.currentSubStage?.substage_id
    );

    if (!currentProgress || currentProgress.status !== "approved")
      return res.status(400).json({ message: "Current substage must be approved before progressing" });

    // Check if there is a next substage in this stage
    const nextSubstage = startup.currentStage.substages[currentSubIndex + 1] || null;

    if (nextSubstage) {
      startup.currentSubStage = nextSubstage;
      await startupRepo.save(startup);
      return res.status(200).json({ message: "Promoted to next substage", startup });
    }

    // No more substages → check for next stage
    const nextStage = await stageRepo.findOne({ where: { order: startup.currentStage.order + 1 }, relations: ["substages"] });

    if (nextStage) {
      return res.status(200).json({
        message: "All substages approved. Ready to promote to next stage",
        startup,
        nextStage,
      });
    }

    res.status(200).json({ message: "All substages approved, startup completed current stage", startup });
  });
}
