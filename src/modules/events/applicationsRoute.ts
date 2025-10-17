import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard } from "@app/middlewares/RBAC/roleGuard";
import express, { Router } from "express";
import { ApplicationController } from "./applicationController";

export class EventApplications {
    //variables only for the class
    public router: Router;
    private eventApplication: ApplicationController;
    constructor() {
        this.router = express.Router();
        this.eventApplication = new ApplicationController();
        this.initializedRoutes();

    }
    //define routes
    private initializedRoutes(): void {
        this.router.post("/:eventId/apply", this.eventApplication.applyToEvent); //public endpoint for all users to apply. 
        this.router.get("/:eventId/applications", 
            protect, adminGuard,
            this.eventApplication.getApplicationsForEvent);//only admin is allowed  to view the applications doen by the students /guests. 
        this.router.put("/:appId/result", 
            protect, adminGuard,
            this.eventApplication.markApplicationResult); //only admins cn updte the status of the applications after review!

    }
}

export default new EventApplications().router;