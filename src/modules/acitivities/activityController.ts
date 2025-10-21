import { Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { AppDataSource } from "@app/DB/data-source";
import { Stage } from "@app/entity/stage";
import { SubStage } from "@app/entity/substage";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";

const stageRepo = AppDataSource.getRepository(Stage);
const subStageRepo = AppDataSource.getRepository(SubStage);

export class StageController {
  // 1️⃣ List all stages (with substages)
  listStages = asyncHandler(async (_req: UserRequest, res: Response) => {
    const stages = await stageRepo.find({
      relations: ["substages", "createdBy"],
      order: { order: "ASC" },
    });
    res.status(200).json(stages);
  });

  // 2️⃣ Create a new stage
  createStage = asyncHandler(async (req: UserRequest, res: Response) => {
    const { name, order } = req.body;
    const creator = req.user!;

    const stage = stageRepo.create({
      name,
      order,
      createdBy: creator as any, // Type assertion because req.user is AuthenticatedUser
    });

    await stageRepo.save(stage);
    res.status(201).json({ message: "Stage created successfully", stage });
  });

  // 3️⃣ Update a stage
  updateStage = asyncHandler(async (req: UserRequest, res: Response) => {
    const { stageId } = req.params;
    const { name, order } = req.body;

    const stage = await stageRepo.findOne({ where: { stage_id: stageId } });
    if (!stage) return res.status(404).json({ message: "Stage not found" });

    if (name) stage.name = name;
    if (order !== undefined) stage.order = order;

    await stageRepo.save(stage);
    res.status(200).json({ message: "Stage updated successfully", stage });
  });

  // 4️⃣ Delete a stage
  deleteStage = asyncHandler(async (req: UserRequest, res: Response) => {
    const { stageId } = req.params;
    const stage = await stageRepo.findOne({ where: { stage_id: stageId } });
    if (!stage) return res.status(404).json({ message: "Stage not found" });

    await stageRepo.remove(stage);
    res.status(200).json({ message: "Stage deleted successfully" });
  });

  // 5️⃣ Create a substage
  createSubStage = asyncHandler(async (req: UserRequest, res: Response) => {
    const { name, order, weightScore, stageId, status } = req.body;
    const creator = req.user!;

    const stage = await stageRepo.findOne({ where: { stage_id: stageId } });
    if (!stage) return res.status(404).json({ message: "Stage not found" });

    const substage = subStageRepo.create({
      name,
      order,
      weightScore,
      stage,
      status: status || "active",
      createdBy: creator as any,
    });

    await subStageRepo.save(substage);
    res.status(201).json({ message: "SubStage created successfully", substage });
  });

  // 6️⃣ Update a substage
  updateSubStage = asyncHandler(async (req: UserRequest, res: Response) => {
    const { substageId } = req.params;
    const { name, order, weightScore, status } = req.body;

    const substage = await subStageRepo.findOne({ where: { substage_id: substageId } });
    if (!substage) return res.status(404).json({ message: "SubStage not found" });

    if (name) substage.name = name;
    if (order !== undefined) substage.order = order;
    if (weightScore !== undefined) substage.weightScore = weightScore;
    if (status) substage.status = status;

    await subStageRepo.save(substage);
    res.status(200).json({ message: "SubStage updated successfully", substage });
  });

  // 7️⃣ Delete a substage
  deleteSubStage = asyncHandler(async (req: UserRequest, res: Response) => {
    const { substageId } = req.params;
    const substage = await subStageRepo.findOne({ where: { substage_id: substageId } });
    if (!substage) return res.status(404).json({ message: "SubStage not found" });

    await subStageRepo.remove(substage);
    res.status(200).json({ message: "SubStage deleted successfully" });
  });

  // 8️⃣ List all substages (for admin)
  listSubStages = asyncHandler(async (_req: UserRequest, res: Response) => {
    const substages = await subStageRepo.find({ relations: ["stage", "createdBy"], order: { order: "ASC" } });
    res.status(200).json(substages);
  });
}
