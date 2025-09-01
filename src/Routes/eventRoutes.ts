import express, {Router } from "express";
import {EventController} from "@app/Controllers/eventController"

export class EventRoutes{
    public router : Router;
    private eventController: EventController; 

    constructor(){
        this.router = express.Router();
        this.eventController = new EventController();
        this.initializedRoutes()
    }

    private initializedRoutes():void{
        this.router.post("/create", this.eventController.createEvent)
        this.router.get("/", this.eventController.getEvents)
        this.router.get("/:id", this.eventController.getEvent)
        this.router.put("/:id", this.eventController.updateEvent)
        this.router.delete("/:id", this.eventController.deleteEvent)
    }
}

export default new EventRoutes().router;