// src/Controllers/eventController.ts
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { Request, Response } from "express";
import { AppDataSource } from "@app/DB/data-source";
import { Event, EventCategory, TargetAudience } from "@app/entity/Event";
import { User } from "@app/entity/User";
import { Role } from "@app/entity/Role";
import { Stage } from "@app/entity/stage";

export class EventController {
  private eventRepository = AppDataSource.getRepository(Event);
  private userRepository = AppDataSource.getRepository(User);
  private roleRepository = AppDataSource.getRepository(Role);
  private stageRepository = AppDataSource.getRepository(Stage);

  // ✅ Create Event (protected)
  createEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const {
      title,
      description,
      location,
      objective,
      date,
      timeFrom,
      timeTo,
      details,
      category,
      targetAudience,
      targetRoleId,
      targetStageId,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found!" });
    }

    const creator = await this.userRepository.findOne({
      where: { id: req.user.id },
      relations: ["role", "stage"],
    });

    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Validate category
    if (category && !Object.values(EventCategory).includes(category)) {
      return res.status(400).json({ message: `Invalid category: ${category}` });
    }

    // 🔹 Validate targetAudience
    const audience =
      targetAudience && Object.values(TargetAudience).includes(targetAudience)
        ? targetAudience
        : TargetAudience.EVERYONE;

    // Optional role/stage associations
    let targetRole = null;
    let targetStage = null;

    if (audience === TargetAudience.ROLE && targetRoleId) {
      targetRole = await this.roleRepository.findOneBy({ id: targetRoleId });
      if (!targetRole)
        return res.status(400).json({ message: "Invalid target role ID" });
    }

    if (audience === TargetAudience.STAGE && targetStageId) {
      targetStage = await this.stageRepository.findOneBy({ stage_id: targetStageId });
      if (!targetStage)
        return res.status(400).json({ message: "Invalid target stage ID" });
    }

    const newEvent = this.eventRepository.create({
      title,
      description,
      location,
      objective,
      date,
      timeFrom,
      timeTo,
      details,
      category: category || EventCategory.OTHER,
      createdBy: creator,
      targetAudience: audience,
      targetRole,
      targetStage,
    });

    await this.eventRepository.save(newEvent);

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  });

  // ✅ Get all Events (public or filtered by user type)
  getEvents = asyncHandler(async (req: UserRequest, res: Response) => {
    let whereCondition: any = [];

    if (!req.user) {
      // Guest user → Only public events
      whereCondition = { targetAudience: TargetAudience.EVERYONE };
    } else {
      // Logged-in user → combine visibility options
      whereCondition = [
        { targetAudience: TargetAudience.EVERYONE },
        { targetAudience: TargetAudience.REGISTERED },
        {
          targetAudience: TargetAudience.ROLE,
          targetRole: { id: req.user.role?.id },
        },
        {
          targetAudience: TargetAudience.STAGE,
          targetStage: { stage_id: req.user.stage?.stage_id },
        },
      ];
    }

    const events = await this.eventRepository.find({
      where: whereCondition,
      relations: ["createdBy", "targetRole", "targetStage", "applications"],
      order: { date: "ASC" },
    });

    res.status(200).json({
      message: "Events fetched successfully",
      events,
    });
  });

  // ✅ Get single Event by ID (still checks access)
  getEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;

    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ["createdBy", "targetRole", "targetStage", "applications"],
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Access check
    if (event.targetAudience === TargetAudience.EVERYONE) {
      return res.json({ event });
    }

    if (!req.user && (event.targetAudience as TargetAudience) !== TargetAudience.EVERYONE) {
      return res.status(403).json({ message: "You must be logged in to view this event" });
    }
    

    const user = await this.userRepository.findOne({
      where: { id: req.user!.id },
      relations: ["role", "stage"],
    });

    const allowed =
      event.targetAudience === TargetAudience.REGISTERED ||
      (event.targetAudience === TargetAudience.ROLE &&
        user?.role?.id === event.targetRole?.id) ||
      (event.targetAudience === TargetAudience.STAGE &&
        user?.stage?.stage_id === event.targetStage?.stage_id);

    if (!allowed)
      return res.status(403).json({ message: "Access denied to this event" });

    res.json({ event });
  });

  // ✅ Update Event
  updateEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      objective,
      date,
      timeFrom,
      timeTo,
      details,
      category,
      targetAudience,
      targetRoleId,
      targetStageId,
    } = req.body;

    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ["targetRole", "targetStage"],
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Validate category
    if (category && !Object.values(EventCategory).includes(category))
      return res.status(400).json({ message: "Invalid category" });

    // Update main fields
    Object.assign(event, {
      title,
      description,
      location,
      objective,
      date,
      timeFrom,
      timeTo,
      details,
      category,
    });

    // Update audience
    if (targetAudience && Object.values(TargetAudience).includes(targetAudience)) {
      event.targetAudience = targetAudience;

      if (targetAudience === TargetAudience.ROLE && targetRoleId) {
        const role = await this.roleRepository.findOneBy({ id: targetRoleId });
        if (!role) return res.status(400).json({ message: "Invalid target role" });
        event.targetRole = role;
      } else if (targetAudience === TargetAudience.STAGE && targetStageId) {
        const stage = await this.stageRepository.findOneBy({ stage_id: targetStageId });
        if (!stage) return res.status(400).json({ message: "Invalid target stage" });
        event.targetStage = stage;
      } else {
        event.targetRole = null;
        event.targetStage = null;
      }
    }

    const updated = await this.eventRepository.save(event);
    res.json({ message: "Event updated successfully", event: updated });
  });

  // ✅ Delete Event
  deleteEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) return res.status(404).json({ message: "Event not found" });

    await this.eventRepository.remove(event);
    res.json({ message: "Event deleted successfully" });
  });

  // ✅ Filter by Category
  getEventsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;

    if (!Object.values(EventCategory).includes(category as EventCategory))
      return res.status(400).json({ message: `Invalid category: ${category}` });

    const events = await this.eventRepository.find({
      where: { category: category as EventCategory },
      relations: ["applications", "targetRole", "targetStage"],
      order: { date: "ASC" },
    });

    res.json({ message: `Events in category: ${category}`, events });
  });
}
