import { Router } from "express";
import { StartupProgressController } from "./startupController";

const router = Router();
const controller = new StartupProgressController();

// Routes for mentee
router.get("/mentee/substages", controller.listMenteeSubstages);
router.post("/mentee/substages/:substageId/submit", controller.submitSubstage);

// Routes for reviewer/admin
router.patch("/review/substages/:progressId", controller.reviewSubstage);

// Check stage progression (mentees can see status)
router.get("/mentee/stage/progression", controller.checkStageProgression);

export default router;
