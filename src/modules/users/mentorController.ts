import { Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { AppDataSource } from "@app/DB/data-source";
import { User } from "@app/entity/User";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { MentorAllocation } from "@app/entity/MentorAllocation";
import { MentorProfile } from "@app/entity/mentorProfile";
import { MenteeProfile } from "@app/entity/menteeProfile";

export class MentorProfileController {
  private profileRepo = AppDataSource.getRepository(MentorProfile);
  private allocRepo = AppDataSource.getRepository(MentorAllocation);
  private userRepo = AppDataSource.getRepository(User);
  private menteeRepo = AppDataSource.getRepository(MenteeProfile);

  /** ✅ Admin: Get all mentors with profiles */
  getAllMentors = asyncHandler(async (req: UserRequest, res: Response) => {
    const mentors = await this.profileRepo.find({
      relations: ["user"],
      order: { created_at: "DESC" },
    });

    const formatted = mentors.map((m) => ({
      user: {
        id: m.user.id,
        fullName: m.user.fullName,
        email: m.user.email,
      },
      specialization: m.specialization,
      experience: m.experience,
      recentProject: m.recentProject,
      contact: m.contact,
    }));

    res.json(formatted);
  });

  /** ✅ Mentor: Get recommended mentees for allocation (matches field first) */
  getRecommendedMentees = asyncHandler(async (req: UserRequest, res: Response) => {
    const mentorId = req.user!.id;

    const mentorProfile = await this.profileRepo.findOne({
      where: { user: { id: mentorId } },
      relations: ["user"],
    });
    if (!mentorProfile) return res.status(404).json({ message: "Mentor profile not found" });

    // All mentees
    const allMentees = await this.menteeRepo.find({
      relations: ["user"],
    });

    // Recommended first: matching field
    const recommended = allMentees.filter(
      (m) => m.field && m.field === mentorProfile.specialization
    );

    // Other mentees
    const others = allMentees.filter(
      (m) => !m.field || m.field !== mentorProfile.specialization
    );

    res.json({ recommended, others });
  });

  /** ✅ Mentor: Get my profile */
  getMyProfile = asyncHandler(async (req: UserRequest, res: Response) => {
    const profile = await this.profileRepo.findOne({
      where: { user: { id: req.user!.id } },
      relations: ["user"],
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  });

  /** ✅ Mentor: Create or update my profile */
  upsertMyProfile = asyncHandler(async (req: UserRequest, res: Response) => {
    const { specialization, experience, recentProject, contact } = req.body;

    let profile = await this.profileRepo.findOne({ where: { user: { id: req.user!.id } } });

    if (profile) {
      profile.specialization = specialization;
      profile.experience = experience;
      profile.recentProject = recentProject;
      profile.contact = contact;
    } else {
      profile = this.profileRepo.create({
        user: { id: req.user!.id },
        specialization,
        experience,
        recentProject,
        contact,
      });
    }

    await this.profileRepo.save(profile);
    res.status(201).json(profile);
  });

  /** ✅ Admin/Mentor: Get profile by mentorId */
  getProfileByMentorId = asyncHandler(async (req: UserRequest, res: Response) => {
    const { mentorId } = req.params;
    const profile = await this.profileRepo.findOne({
      where: { user: { id: mentorId } },
      relations: ["user"],
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  });

  /** ✅ Mentor: Get my allocated students */
  getMyStudents = asyncHandler(async (req: UserRequest, res: Response) => {
    const allocations = await this.allocRepo.find({
      where: { mentor: { id: req.user!.id } },
      relations: ["student", "student.menteeProfile"],
    });

    const students = allocations.map((a) => ({
      id: a.student.id,
      name: a.student.fullName,
      field: a.student.menteeProfile?.field ?? null,
    }));

    res.json({ students });
  });

  /** ✅ Admin: Assign a student to a mentor (flexible, recommended first suggested) */
  assignStudent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { mentorId, studentId } = req.body;

    const mentor = await this.userRepo.findOne({ where: { id: mentorId }, relations: ["mentorProfile"] });
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const student = await this.userRepo.findOne({ where: { id: studentId }, relations: ["menteeProfile"] });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const existing = await this.allocRepo.findOne({
      where: { mentor: { id: mentorId }, student: { id: studentId } },
    });
    if (existing) return res.status(400).json({ message: "Student already assigned to this mentor" });

    const allocation = this.allocRepo.create({ mentor, student });
    await this.allocRepo.save(allocation);

    res.status(201).json({ message: "Student assigned to mentor", allocation });
  });

  /** ✅ Admin: Unassign a student from a mentor */
  unassignStudent = asyncHandler(async (req: UserRequest, res: Response) => {
    const { allocationId } = req.params;
    const allocation = await this.allocRepo.findOne({ where: { id: allocationId } });
    if (!allocation) return res.status(404).json({ message: "Allocation not found" });

    await this.allocRepo.remove(allocation);
    res.json({ message: "Student unassigned from mentor" });
  });

  /** ✅ Student: Get my allocated mentor */
  getMyMentor = asyncHandler(async (req: UserRequest, res: Response) => {
    const allocation = await this.allocRepo.findOne({
      where: { student: { id: req.user!.id } },
      relations: ["mentor", "mentor.mentorProfile"],
    });

    if (!allocation) return res.status(404).json({ message: "No mentor allocated to this student" });

    const mentor = allocation.mentor;
    const profile = mentor.mentorProfile;

    res.json({
      id: mentor.id,
      name: mentor.fullName,
      email: mentor.email,
      specialization: profile?.specialization,
      experience: profile?.experience,
      recentProject: profile?.recentProject,
      contact: profile?.contact,
    });
  });

  /** ✅ Admin: View all mentor-student allocations */
  getAllAllocations = asyncHandler(async (req: UserRequest, res: Response) => {
    const allocations = await this.allocRepo.find({
      relations: ["mentor", "mentor.mentorProfile", "student", "student.menteeProfile"],
      order: { created_at: "DESC" },
    });

    const formatted = allocations.map((a) => ({
      id: a.id,
      mentor: {
        id: a.mentor.id,
        name: a.mentor.fullName,
        specialization: a.mentor.mentorProfile?.specialization,
      },
      student: {
        id: a.student.id,
        name: a.student.fullName,
        field: a.student.menteeProfile?.field,
      },
    }));

    res.json({ allocations: formatted });
  });
}
