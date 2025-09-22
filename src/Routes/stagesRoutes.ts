import { StageController } from "@app/Controllers/stagesController";
import { Router } from "express";

const router = Router();
const controller = new StageController();

router.put("/promote/:studentId", controller.promoteStage);
router.post("/progress/:studentId", controller.updateProgress);
router.get("/stage/:studentId", controller.getStudentStage);
router.get("/logs/:studentId", controller.getStudentProgress);

export default router;
