import { Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { AppDataSource } from "@app/DB/data-source";
import { Notification, NotificationType } from "@app/entity/Notifications";
import { User } from "@app/entity/User";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { NotificationGroup } from "@app/entity/NotificationGroup";

export class NotificationController {
    private notifRepo = AppDataSource.getRepository(Notification);
    private userRepo = AppDataSource.getRepository(User);
    private groupRepo = AppDataSource.getRepository(NotificationGroup);

    /**
     * Create a notification.
     * - If recipientId provided -> create single notification for that user.
     * - If no recipientId -> assume student is notifying admins.
     */
    createNotification = asyncHandler(async (req: UserRequest, res: Response) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { recipientId, message, type } = req.body;

        if (!message || typeof message !== "string") {
            res.status(400).json({ message: "message is required" });
            return
        }

        const notifType: NotificationType =
            (type as NotificationType) || NotificationType.UPDATE;

        // single recipient
        if (recipientId) {
            const recipient = await this.userRepo.findOne({ where: { id: recipientId } });
            if (!recipient) return res.status(404).json({ message: "Recipient not found" });


            const n = this.notifRepo.create({
                user: recipient,
                sender: { id: req.user.id } as User,
                message,
                type: notifType,
            });
            await this.notifRepo.save(n);
            res.status(201).json(n);
            return
        }

        // no recipient -> send to admins
        const admins = await this.userRepo.find({
            where: { role: { name: "admin" } as any },
            relations: ["role"],
        });

        if (!admins.length) {
            res.status(400).json({ message: "No admin recipients found" });
            return
        }

        const batch = admins.map((a) =>
            this.notifRepo.create({
                user: a,
                sender: { id: req.user!.id } as User, // ✅ FIX
                message,
                type: notifType,
            })
        );

        await this.notifRepo.save(batch);
        res.status(201).json({ message: "Notifications sent to admins", count: batch.length });
        return
    });

    /**
     * Admin broadcast.
     * Handled by route guards → no role check here.
     */
    broadcastNotification = asyncHandler(async (req: UserRequest, res: Response) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { recipientIds, groupId, all, message, type } = req.body;

        if (!message || typeof message !== "string") {
            res.status(400).json({ message: "message is required" });
            return
        }

        const notifType: NotificationType =
            (type as NotificationType) || NotificationType.UPDATE;

        let recipients: User[] = [];

        if (Array.isArray(recipientIds) && recipientIds.length > 0) {
            for (const id of recipientIds) {
                const u = await this.userRepo.findOne({ where: { id } });
                if (u) recipients.push(u);
            }
        } else if (groupId) {
            const group = await this.groupRepo.findOne({
                where: { id: groupId },
                relations: ["members"],
            });
            if (!group) return res.status(404).json({ message: "Group not found" });
            recipients = group.members;
        } else if (all) {
            recipients = await this.userRepo.find();
        } else {
            res.status(400).json({ message: "recipientIds, groupId or all required" });
            return
        }

        if (!recipients.length) {
            res.status(400).json({ message: "No recipients resolved" });
            return
        }

        const batch = recipients.map((r) =>
            this.notifRepo.create({
                user: r,
                sender: { id: req.user!.id } as User, // ✅ FIX
                message,
                type: notifType,
            })
        );

        await this.notifRepo.save(batch);

        res.status(201).json({ message: "Broadcast sent", count: batch.length });
        return
    });


    // Get notifications for logged-in user
    getMyNotifications = asyncHandler(async (req: UserRequest, res: Response) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const notifications = await this.notifRepo.find({
            where: { user: { id: req.user.id } as any },
            relations: ["sender"],
            order: { created_at: "DESC" },
        });
        res.json(notifications);
        return
    });

    // Mark as read
    markAsRead = asyncHandler(async (req: UserRequest, res: Response) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const { id } = req.params;

        const notif = await this.notifRepo.findOne({
            where: { id },
            relations: ["user"],
        });
        if (!notif) return res.status(404).json({ message: "Notification not found" });

        if (notif.user.id !== req.user.id) {
            res.status(403).json({ message: "Not authorized to modify this notification" });
            return
        }

        notif.is_read = true;
        await this.notifRepo.save(notif);
        res.json({ message: "Marked as read", id: notif.id });
        return
    });

    //handle groups: 
    /** Create a new notification group */
createGroup = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { name, memberIds } = req.body;
  
      if (!name || typeof name !== "string") {
        return res.status(400).json({ message: "Group name is required" });
      }
  
      const members: User[] = [];
      if (Array.isArray(memberIds)) {
        for (const id of memberIds) {
          const user = await this.userRepo.findOne({ where: { id } });
          if (user) members.push(user);
        }
      }
  
      const group = this.groupRepo.create({ name, members });
      await this.groupRepo.save(group);
  
      res.status(201).json(group);
    } catch (err) {
      console.error("Error creating group:", err);
      res.status(500).json({ message: "Failed to create group" });
    }
  });
  
  /** Add users to an existing group */
  addUsersToGroup = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { groupId, memberIds } = req.body;
  
      const group = await this.groupRepo.findOne({ where: { id: groupId }, relations: ["members"] });
      if (!group) return res.status(404).json({ message: "Group not found" });
  
      for (const id of memberIds) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (user && !group.members.some((m) => m.id === user.id)) {
          group.members.push(user);
        }
      }
  
      await this.groupRepo.save(group);
      res.json({ message: "Users added", group });
    } catch (err) {
      console.error("Error adding users to group:", err);
      res.status(500).json({ message: "Failed to add users to group" });
    }
  });
  
  /** Remove a user from a group */
  removeUserFromGroup = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { groupId, userId } = req.body;
  
      const group = await this.groupRepo.findOne({ where: { id: groupId }, relations: ["members"] });
      if (!group) return res.status(404).json({ message: "Group not found" });
  
      group.members = group.members.filter((m) => m.id !== userId);
      await this.groupRepo.save(group);
  
      res.json({ message: "User removed", group });
    } catch (err) {
      console.error("Error removing user from group:", err);
      res.status(500).json({ message: "Failed to remove user from group" });
    }
  });
  
  /** List all groups with members */
  listGroups = asyncHandler(async (_req: UserRequest, res: Response) => {
    try {
      const groups = await this.groupRepo.find({ relations: ["members"] });
      res.json(groups);
    } catch (err) {
      console.error("Error listing groups:", err);
      res.status(500).json({ message: "Failed to list groups" });
    }
  });
  
  /** Delete a group */
  deleteGroup = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { groupId } = req.params;
  
      const group = await this.groupRepo.findOne({ where: { id: groupId } });
      if (!group) return res.status(404).json({ message: "Group not found" });
  
      await this.groupRepo.remove(group);
      res.json({ message: "Group deleted", id: groupId });
    } catch (err) {
      console.error("Error deleting group:", err);
      res.status(500).json({ message: "Failed to delete group" });
    }
  });
  
  
}
