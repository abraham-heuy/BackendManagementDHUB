import { Router } from "express";
import { StageController } from "./activityController";
import { protect } from "@app/middlewares/RBAC/protect";

export class StageRoutes {
  public router: Router;
  private controller: StageController;

  constructor() {
    this.router = Router();
    this.controller = new StageController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // ===== Stage Routes =====
    this.router.get("/stages",protect,this.controller.listStages); // List all stages
    this.router.post("/stages",protect,this.controller.createStage); // Create stage
    this.router.put("/stages/:stageId",protect,this.controller.updateStage); // Update stage
    this.router.delete("/stages/:stageId",protect,this.controller.deleteStage); // Delete stage

    // ===== SubStage Routes =====
    this.router.get("/substages",protect,this.controller.listSubStages); // List all substages
    this.router.post("/substages", protect,this.controller.createSubStage); // Create substage
    this.router.put("/substages/:substageId",protect,this.controller.updateSubStage); // Update substage
    this.router.delete("/substages/:substageId",protect,this.controller.deleteSubStage); // Delete substage
  }
}
  //use it in the main entry as an instance like so: 
  //// app.use("/api/admin", new StageRoutes().router);
