// src/Controllers/eventController.ts
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { Response } from "express";
import { AppDataSource } from "@app/DB/data-source";
import { Event } from "@app/entity/Event";
import { User } from "@app/entity/User";

export class EventController {
  private eventRepository = AppDataSource.getRepository(Event);
  private userRepository = AppDataSource.getRepository(User);

  // Create Event
  createEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { title, description, start_date, end_date } = req.body;

    if (!req.user) {
      res.status(401);
      throw new Error("Unauthorized: No user found!");
    }

    const creator = await this.userRepository.findOneBy({ id: req.user.id });
    if (!creator) {
      res.status(404);
      throw new Error("User not found");
    }

    const newEvent = this.eventRepository.create({
      title,
      description,
      start_date,
      end_date,
      createdBy: creator,
    });

    await this.eventRepository.save(newEvent);

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  });

  // Get all Events
  getEvents = asyncHandler(async (_req: UserRequest, res: Response) => {
    const events = await this.eventRepository.find({
      relations: ["createdBy"],
    });

    res.status(200).json({
      message: "Events fetched successfully",
      events,
    });
  });

  // Get Event by ID
  getEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;

    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ["createdBy"],
    });

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    res.status(200).json({
      message: "Event fetched successfully",
      event,
    });
  });

  // Update Event
  updateEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) {
      res.status(401);
      throw new Error("Unauthorized: No user found!");
    }

    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    this.eventRepository.merge(event, req.body);
    const updatedEvent = await this.eventRepository.save(event);

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  });

  // Delete Event
  deleteEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) {
      res.status(401);
      throw new Error("Unauthorized: No user found!");
    }

    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    await this.eventRepository.remove(event);

    res.status(200).json({
      message: "Event deleted successfully",
    });
  });
}
