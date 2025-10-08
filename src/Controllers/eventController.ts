// src/Controllers/eventController.ts
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { Request, Response } from "express";
import { AppDataSource } from "@app/DB/data-source";
import { Event, EventCategory } from "@app/entity/Event";
import { User } from "@app/entity/User";

export class EventController {
  private eventRepository = AppDataSource.getRepository(Event);
  private userRepository = AppDataSource.getRepository(User);

  // ✅ Create Event (protected)
  createEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { title, description, location, objective, date, timeFrom, timeTo, details, category } =
      req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found!" });
    }

    const creator = await this.userRepository.findOneBy({ id: req.user.id });
    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Validate category
    if (category && !Object.values(EventCategory).includes(category)) {
      return res.status(400).json({ message: `Invalid category: ${category}` });
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
    });

    await this.eventRepository.save(newEvent);

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  });

  // ✅ Get all Events (public)
  getEvents = asyncHandler(async (_req: Request, res: Response) => {
    const events = await this.eventRepository.find({
      relations: ["createdBy", "applications"],
      order: { date: "ASC" },
    });

    res.status(200).json({
      message: "Events fetched successfully",
      events,
    });
  });

  // ✅ Get Event by ID (public)
  getEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ["createdBy", "applications"],
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event fetched successfully",
      event,
    });
  });

  // ✅ Update Event (protected)
  updateEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found!" });
    }

    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Validate category if updating
    if (req.body.category && !Object.values(EventCategory).includes(req.body.category)) {
      return res.status(400).json({ message: `Invalid category: ${req.body.category}` });
    }

    this.eventRepository.merge(event, req.body);
    const updatedEvent = await this.eventRepository.save(event);

    res.status(200).json({
      message: "Event updated successfully", 
      event: updatedEvent,
    });
  });

  // ✅ Delete Event (protected)
  deleteEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found!" });
    }

    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await this.eventRepository.remove(event);

    res.status(200).json({
      message: "Event deleted successfully",
    });
  });

  // ✅ Filter Events by Category (public)
  getEventsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;

    // Convert string → enum
    if (!Object.values(EventCategory).includes(category as EventCategory)) {
      return res.status(400).json({ message: `Invalid category: ${category}` });
    }

    const events = await this.eventRepository.find({
      where: { category: category as EventCategory },
      relations: ["applications"],
      order: { date: "ASC" },
    });

    res.status(200).json({
      message: `Events in category: ${category}`,
      events,
    });
  });
}
