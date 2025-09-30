import { ApplicationController } from "@app/Controllers/applicationController";
import express, { Router } from "express";

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
        this.router.post("/:eventId/apply", this.eventApplication.applyToEvent);
        this.router.get("/:eventId/applications", this.eventApplication.getApplicationsForEvent);
        this.router.put("/:appId/result", this.eventApplication.markApplicationResult);

    }
}

export default new EventApplications().router;