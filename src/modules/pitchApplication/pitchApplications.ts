import { Response, Request } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { AppDataSource } from "@app/DB/data-source";
import bcrypt from "bcryptjs";
import { ILike } from "typeorm";

import { Applications } from "@app/entity/pitching_applications";
import { User } from "@app/entity/User";
import { Startup } from "@app/entity/startup";
import { SubStage } from "@app/entity/substage";
import { Stage } from "@app/entity/stage";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";

const applicationRepo = AppDataSource.getRepository(Applications);
const userRepo = AppDataSource.getRepository(User);
const startupRepo = AppDataSource.getRepository(Startup);
const stageRepo = AppDataSource.getRepository(Stage);
const subStageRepo = AppDataSource.getRepository(SubStage);

export class ApplicationsController {

  createApplication = asyncHandler(async (req: UserRequest, res: Response) => {
    const {
      first_name,
      last_name,
      surname,
      email,
      phone,
      regNo,
      businessIdea,
      problemStatement,
      solution,
      targetMarket,
      revenueModel,
      teamMembers,
    } = req.body;
  
    // ✅ Validate required fields
    if (!first_name || !last_name || !email || !businessIdea || !problemStatement || !solution) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // ✅ Check if user already applied
    const existing = await applicationRepo.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "An application with this email already exists" });
    }
  
    // ✅ Create application aligned with entity fields
    const newApp = applicationRepo.create({
      first_name,
      last_name,
      surname,
      email,
      phone,
      regNo,
      businessIdea,
      problemStatement,
      solution,
      targetMarket: targetMarket || "Not specified",
      revenueModel: revenueModel || "Not specified",
      teamMembers: Array.isArray(teamMembers)
        ? teamMembers
        : teamMembers
        ? [teamMembers]
        : [],
      status: "pending",
    });
  
    await applicationRepo.save(newApp);
  
    res.status(201).json({
      message: "Application submitted successfully",
      application: newApp,
    });
  });
  
  listApplications = asyncHandler(async (_req: UserRequest, res: Response) => {
    const apps = await applicationRepo.find({
      relations: ["user", "startup"],
      order: { createdAt: "DESC" }, 
    });
    res.status(200).json(apps);
  });

  getApplication = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const app = await applicationRepo.findOne({
      where: { application_id: id },
      relations: ["user", "startup"],
    });

    if (!app) return res.status(404).json({ message: "Application not found" });

    res.status(200).json(app);
  });

  approveApplication = asyncHandler(async (req: UserRequest, res: Response) => {
    const { applicationId } = req.params;

    const app = await applicationRepo.findOne({
      where: { application_id: applicationId },
      relations: ["user"],
    });

    if (!app) return res.status(404).json({ message: "Application not found" });
    if (app.status === "approved")
      return res.status(400).json({ message: "Application already approved" });

    app.status = "approved";
    await applicationRepo.save(app);

    // Construct full name properly
    const fullName =
      [app.first_name, app.last_name].filter(Boolean).join(" ") ||
      "Applicant";

    // Try to find user
    let user = await userRepo.findOne({ where: { email: app.email } });

    // If user not found, create one
    if (!user) {
      const emailPrefix = app.email.split("@")[0];
      const generatedPassword = `${emailPrefix}@Desic123`;
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // ✅ Fix: avoid null assignment to optional properties
      const newUser = userRepo.create({
        fullName,
        email: app.email,
        password: hashedPassword,
        regNumber: app.regNo || undefined, // undefined instead of null
        // add phone if exists
        ...(app.phone ? { currentProject: app.phone } : {}),
      });

      user = await userRepo.save(newUser);
      (user as any).generatedPassword = generatedPassword;
    }

    app.user = user;
    await applicationRepo.save(app);

    // Lookup default stage/substage
    const stage = await stageRepo.findOne({ where: { name: ILike("pre-incubation") } });
    const subStage = await subStageRepo.findOne({ where: { name: ILike("ideation") } });

    if (!stage || !subStage)
      return res.status(400).json({ message: "Default stage or sub-stage not found" });

    // ✅ Fix: ensure founder is always defined (user guaranteed)
    const startup = startupRepo.create({
      title: app.businessIdea?.substring(0, 60) || "New Startup",
      description: app.solution || "No description provided",
      founder: user,
      teamMembers: Array.isArray(app.teamMembers)
        ? app.teamMembers
        : app.teamMembers
        ? [app.teamMembers]
        : [],
      currentStage:stage,
      currentSubStage:subStage,
      status: "active",
      application: app,
    });

    await startupRepo.save(startup);

    res.status(201).json({
      message: "Application approved. User and startup created successfully.",
      user,
      startup,
    });
  });

  rejectApplication = asyncHandler(async (req: UserRequest, res: Response) => {
    const { applicationId } = req.params;

    const app = await applicationRepo.findOne({
      where: { application_id: applicationId },
    });

    if (!app) return res.status(404).json({ message: "Application not found" });

    app.status = "rejected";
    await applicationRepo.save(app);

    res.status(200).json({ message: "Application rejected successfully" });
  });

  deleteApplication = asyncHandler(async (req: UserRequest, res: Response) => {
    const { applicationId } = req.params;

    const app = await applicationRepo.findOne({
      where: { application_id: applicationId },
    });

    if (!app) return res.status(404).json({ message: "Application not found" });

    await applicationRepo.remove(app);
    res.status(200).json({ message: "Application deleted successfully" });
  });
}
