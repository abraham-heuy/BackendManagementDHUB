import express, {Router } from "express";
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard, adminorStaffGuard } from "@app/middlewares/RBAC/roleGuard";
import { EventController } from "./eventController";

export class EventRoutes{
    public router : Router;
    private eventController: EventController; 

    constructor(){
        this.router = express.Router();
        this.eventController = new EventController();
        this.initializedRoutes()
    }

    private initializedRoutes():void{
        this.router.post("/create",
            protect, 
            adminGuard,
            this.eventController.createEvent) //either be an admin or an associated management role? 
        this.router.get("/", this.eventController.getEvents) // all users
        this.router.get("/:id", this.eventController.getEvent)
        this.router.put("/:id",
            protect,adminGuard,
            this.eventController.updateEvent) //updatedby the one who posted it
        this.router.delete("/:id",
            protect,adminGuard,
            this.eventController.deleteEvent)
        this.router.get("/category/:category", this.eventController.getEventsByCategory) //filter can be done publicly by all users.
    }
}
 
export default new EventRoutes().router; 