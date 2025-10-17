import { protect } from "@app/middlewares/RBAC/protect";
import { Router } from "express";
import { ApplicationsController } from "./pitchApplications";


const router = Router();
const controller = new ApplicationsController();

// Admin or reviewer protected routes
router.get("/", protect, controller.listApplications);
router.get("/:id", protect, controller.getApplication);
router.patch("/:applicationId/approve", protect, controller.approveApplication);
router.patch("/:applicationId/reject", protect, controller.rejectApplication);
router.delete("/:applicationId", protect, controller.deleteApplication);

export default router;
