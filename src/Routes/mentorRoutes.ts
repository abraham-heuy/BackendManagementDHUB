// src/routes/mentorProfileRoutes.ts
import { MentorProfileController } from "@app/Controllers/mentorController";
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard, adminorStaffGuard, mentorGuard, studentGuard } from "@app/middlewares/RBAC/roleGuard";
import { Router } from "express";

export class MentorProfileRoutes {
  public router: Router;
  private controller: MentorProfileController;

  constructor() {
    this.router = Router();
    this.controller = new MentorProfileController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Mentor: Get my profile (protected by guard, id must match logged user)
    this.router.get("/me/profile",
      protect, mentorGuard,
      this.controller.getMyProfile);

    // Mentor: Create or update my profile (protected by guard, id must match logged user)
    this.router.post("/me/profile", 
      protect, mentorGuard, 
      this.controller.upsertMyProfile);

    // Admin/Mentor: Get profile by mentorId (admin can view any, mentor can view self)
    this.router.get("/profile/:mentorId",
      protect, adminorStaffGuard, 
      this.controller.getProfileByMentorId);

    // Mentor: Get my allocated students (protected by guard, id must match logged user)
    this.router.get("/me/students", 
      protect, mentorGuard, 
      this.controller.getMyStudents);

    // Student: Get my allocated mentor (protected by guard, id must match logged user)
    this.router.get("/me/mentor", 
      protect, studentGuard, 
      this.controller.getMyMentor);  

    // Admin: Assign a student to a mentor
    this.router.post("/assign", 
      protect, adminGuard,
      this.controller.assignStudent);

    // Admin: Unassign a student from a mentor
    this.router.delete("/allocation/:allocationId", 
      protect, adminGuard,
      this.controller.unassignStudent);
  }
}

export default new MentorProfileRoutes().router;