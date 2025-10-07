// src/Controllers/applicationController.ts
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { Response } from "express";
import { AppDataSource } from "@app/DB/data-source";
import { EventApplication } from "@app/entity/EventApplication";
import { Event } from "@app/entity/Event";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";

export class ApplicationController {
  private applicationRepo = AppDataSource.getRepository(EventApplication);
  private eventRepo = AppDataSource.getRepository(Event);

  // Apply to event
  applyToEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { eventId } = req.params;
    const {
      regNo,
      name,
      email,
      phone,
      teamMembers,
      businessIdea,
      problemStatement,
      solution,
      targetMarket,
      revenueModel,
    } = req.body;

    const event = await this.eventRepo.findOneBy({ id: eventId });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const application = this.applicationRepo.create({
      regNo,
      name,
      email,
      phone,
      teamMembers,
      businessIdea,
      problemStatement,
      solution,
      targetMarket, 
      revenueModel,
      event,
    });

    await this.applicationRepo.save(application);

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  });

  // Get all applications for an event
  getApplicationsForEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { eventId } = req.params;

    const applications = await this.applicationRepo.find({
      where: { event: { id: eventId } },
      relations: ["event"],
    });

    res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  });

  // Admin marks pass/fail
  markApplicationResult = asyncHandler(async (req: UserRequest, res: Response) => {
    const { appId } = req.params;
    const { isPassed } = req.body;

    const application = await this.applicationRepo.findOneBy({ id: appId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.isPassed = isPassed;
    await this.applicationRepo.save(application);

    res.status(200).json({
      message: `Application ${isPassed ? "approved" : "rejected"}`,
      application,
    });
  });
}
