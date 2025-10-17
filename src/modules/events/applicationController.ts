// src/Controllers/applicationController.ts
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { Response } from "express";
import { AppDataSource } from "@app/DB/data-source";
import { EventApplication } from "@app/entity/EventApplication";
import { Event, TargetAudience } from "@app/entity/Event";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";

export class ApplicationController {
  private applicationRepo = AppDataSource.getRepository(EventApplication);
  private eventRepo = AppDataSource.getRepository(Event);

  // ✅ Apply to an Event
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

    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ["targetRole", "targetStage"],
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔹 Access check
    if (event.targetAudience !== TargetAudience.EVERYONE && !req.user) {
      return res
        .status(403)
        .json({ message: "You must be logged in to apply for this event" });
    }

    // 🔹 Prevent duplicate application by email
    const existing = await this.applicationRepo.findOne({
      where: { email, event: { id: eventId } },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already applied to this event" });
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

  // ✅ Get all applications for a specific Event
  getApplicationsForEvent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { eventId } = req.params;

    const event = await this.eventRepo.findOneBy({ id: eventId });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const applications = await this.applicationRepo.find({
      where: { event: { id: eventId } },
      relations: ["event"],
      order: { appliedAt: "DESC" },
    });

    res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  });

  // ✅ Mark Application as Passed or Failed (handled via role middleware)
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
