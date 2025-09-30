import { Router } from "express";
import { protect } from "@app/middlewares/RBAC/protect";
import { NotificationController } from "@app/Controllers/notificationsController";

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
    this.router.post("/", protect, this.controller.createNotification);

    // Admin broadcast
    this.router.post("/broadcast", protect, this.controller.broadcastNotification);

    // Get logged-in user's notifications
    this.router.get("/", protect, this.controller.getMyNotifications);

    // Mark as read
    this.router.patch("/:id/read", protect, this.controller.markAsRead);
  }
}

export default new NotificationRoutes().router;
