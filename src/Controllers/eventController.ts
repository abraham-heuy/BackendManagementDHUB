import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { NextFunction, Response } from "express";
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from "@app/Models/eventModel";
export const createEventHandler = asyncHandler(
    async (req: UserRequest, res: Response) => {
        const { title, description, start_date, end_date } = req.body;

        if (!req.user) {
            res.status(401);
            throw new Error("Unauthorized: No user found!");
        }

        const newEvent = await createEvent({
            title,
            description,
            start_date,
            end_date,
            created_by: req.user.clerkId,
        });

        res.status(201).json({
            message: "Event created successfully",
            event: newEvent,
        });
        return
    }
);

//get all the events
export const getEventsHandler = asyncHandler(
  async (req: UserRequest, res: Response, next:NextFunction) => {
    try {
      const events = await getAllEvents();

      res.status(200).json({
        message: "Events fetched successfully",
        events,
      });
      return;
    } catch (error: unknown) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//get event by Id 
export const getEventHandler = asyncHandler(
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const event = await getEventById(id);

      if (!event) {
        res.status(404);
        throw new Error("Event not found");
      }

      res.status(200).json({
        message: "Event fetched successfully"
      });
      return;
    } catch (error: unknown) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//update the events
export const updateEventHandler = asyncHandler(
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized: No user found!");
      }

      const updatedEvent = await updateEvent(id, req.body);

      if (!updatedEvent) {
        res.status(404);
        throw new Error("Event not found");
      }

      res.status(200).json({
        message: "Event updated successfully",
        event: updatedEvent,
      });
      return;
    } catch (error: unknown) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//delete the event

export const deleteEventHandler = asyncHandler(
  async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized: No user found!");
      }

      const deleted = await deleteEvent(id);

      if (!deleted) {
        res.status(404);
        throw new Error("Event not found");
      }

      res.status(200).json({
        message: "Event deleted successfully",
      });
      return;
    } catch (error: unknown) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);