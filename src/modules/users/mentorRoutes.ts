// src/routes/mentorProfileRoutes.ts
import { protect } from "@app/middlewares/RBAC/protect";
import { adminGuard, adminorStaffGuard, mentorGuard, studentGuard } from "@app/middlewares/RBAC/roleGuard";
import { Router } from "express";
import { MentorProfileController } from "./mentorController";

export class MentorProfileRoutes {
  public router: Router;
  private controller: MentorProfileController;

  constructor() {
    this.router = Router();
    this.controller = new MentorProfileController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    //get all the mentors from the logged data!
    this.router.get("/all",
      protect, adminGuard,
      this.controller.getAllMentors
    )
    // Mentor: Get my profile (protected by guard, id must match logged user)
    this.router.get("/me/profile",
      protect, mentorGuard,
      this.controller.getMyProfile);

    // Mentor: Create or update my profile (protected by guard, id must match logged user)
    this.router.post("/me/profile",
      protect,
      this.controller.upsertMyProfile);

    // Admin/Mentor: Get profile by mentorId (admin can view any, mentor can view self)
    this.router.get("/profile/:mentorId",
      protect, adminorStaffGuard,
      this.controller.getProfileByMentorId);

    // Mentor: Get my allocated students (protected by guard, id must match logged user)
    this.router.get("/me/students",
      protect,
      this.controller.getMyStudents);

    // Student: Get my allocated mentor (protected by guard, id must match logged user)
    this.router.get("/me/mentor",
      protect, studentGuard,
      this.controller.getMyMentor);

    // Admin: Assign a student to a mentor
    this.router.post("/allocate",
      protect, adminGuard,
      this.controller.assignStudent);
      //get all allocations.
    this.router.get("/allocations",
      protect, adminGuard,
      this.controller.getAllAllocations
    )
    this.router.get("/recommended/:mentorId",
       protect, adminGuard,
        this.controller.getRecommendedMentees)
    // Admin: Unassign a student from a mentor
    this.router.delete("/allocation/:allocationId",
      protect, adminGuard,
      this.controller.unassignStudent);
  }
}

export default new MentorProfileRoutes().router;