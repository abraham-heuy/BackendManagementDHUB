import { Router } from "express";
import { StartupProgressController } from "./startupController";
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard } from "@app/middlewares/RBAC/roleGuard";

const router = Router();
const controller = new StartupProgressController();

// Routes for mentee
router.get("/mentee/substages",protect,controller.listMenteeSubstages);
router.post("/mentee/substages/:substageId/submit",protect,controller.submitSubstage);

// Routes for reviewer/admin
router.patch("/review/substages/:progressId",protect,adminGuard,controller.reviewSubstage);

// Check stage progression (mentees can see status)
router.get("/mentee/stage/progression",protect,controller.checkStageProgression);

export default router;
