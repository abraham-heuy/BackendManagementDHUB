import { Router } from "express";
import { protect } from "@app/middlewares/RBAC/protect";
import { NotificationController } from "@app/Controllers/notificationsController";
import { adminGuard } from "@app/middlewares/RBAC/roleGuard";

export class NotificationRoutes {
  public router: Router;
  private controller: NotificationController;

  constructor() {
    this.router = Router();
    this.controller = new NotificationController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a notification (student/system → admin or direct recipient)
    this.router.post("/", protect,adminGuard,this.controller.createNotification);
    // Admin broadcast
    this.router.post("/broadcast", protect,adminGuard,this.controller.broadcastNotification);
    // Get logged-in user's notifications
    this.router.get("/", protect,this.controller.getMyNotifications);
    this.router.get("/admin", protect, this.controller.getMyNotifications)
    // Mark as read
    this.router.patch("/:id/read", protect, this.controller.markAsRead);
    //group routes? 
    this.router.post("/groups", protect,adminGuard,this.controller.createGroup); 
    this.router.get("/groups", protect,adminGuard, this.controller.listGroups);
    this.router.patch("/groups/add", protect, adminGuard,this.controller.addUsersToGroup);
    this.router.patch("/groups/remove", protect,adminGuard,this.controller.removeUserFromGroup);
    this.router.delete("/groups/:groupId", protect,adminGuard,this.controller.deleteGroup);


  }
}

export default new NotificationRoutes().router;
