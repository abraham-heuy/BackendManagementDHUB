// src/routes/progressLogRoutes.ts
import { Router } from "express";
import { protect } from "@app/middlewares/RBAC/protect";
import { ProgressLogController } from "@app/Controllers/progressLogControllers";

export class ProgressLogRoutes {
  public router: Router;
  private controller: ProgressLogController;

  constructor() {
    this.router = Router();
    this.controller = new ProgressLogController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a progress log
    this.router.post("/", protect, this.controller.createLog);

    // Get logs for a specific student
    this.router.get("/student/:studentId", protect, this.controller.getLogsForStudent);

    // Get all logs
    this.router.get("/", protect, this.controller.getAllLogs);

  }
}

export default new ProgressLogRoutes().router;

// I will add the guards also in the routes during testing. 