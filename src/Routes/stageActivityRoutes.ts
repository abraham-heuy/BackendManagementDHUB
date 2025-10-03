import { StageActivityController } from "@app/Controllers/stageActivityController";
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard } from "@app/middlewares/RBAC/roleGuard";
import { Router } from "express";


export class StageActivityRoutes {
  public router: Router;
  private controller: StageActivityController;

  constructor() {
    this.router = Router();
    this.controller = new StageActivityController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Admin: Create activity
    this.router.post("/", 
      protect, adminGuard,
      this.controller.createActivity);

    // Admin: Update activity
    this.router.put("/:id", 
      protect,adminGuard, 
      this.controller.updateActivity);

    // Admin: Delete activity
    this.router.delete("/:id", 
      protect, adminGuard,
      this.controller.deleteActivity);

    // Get all activities by stage
    this.router.get("/:stageId", protect,this.controller.getActivitiesByStage);
  }
}

export default new StageActivityRoutes().router;


//add a layered guard for admin, AdminGuard.... done✅🥃