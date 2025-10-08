// src/Services.ts/reportsService.ts
import { AppDataSource } from "@app/DB/data-source";
import { Event } from "@app/entity/Event";
import { EventApplication } from "@app/entity/EventApplication";
import { StudentStage } from "@app/entity/StudentStage";
import { MentorAllocation } from "@app/entity/MentorAllocation";
import { User } from "@app/entity/User";

export class ReportsService {
  private eventRepo = AppDataSource.getRepository(Event);
  private appRepo = AppDataSource.getRepository(EventApplication);
  private stageRepo = AppDataSource.getRepository(StudentStage);
  private mentorAllocRepo = AppDataSource.getRepository(MentorAllocation);
  private userRepo = AppDataSource.getRepository(User);

  // 🧾 Applications Report
  async getApplicationsReport() {
    return await this.appRepo
      .createQueryBuilder("app")
      .leftJoinAndSelect("app.student", "student")
      .leftJoinAndSelect("app.event", "event")
      .select([
        "student.fullName AS studentName",
        "event.title AS event",
        "app.isPassed AS status"
      ])
      .getRawMany();
  }

  // 🎉 Events Report
  async getEventsReport() {
    return await this.eventRepo
      .createQueryBuilder("event")
      .select([
        "event.title AS eventName",
        "event.category AS category",
        "event.date AS date",
        "event.location AS location"
      ])
      .getRawMany();
  }

  // 🎓 Student Progress Report
  async getProgressReport() {
    return await this.stageRepo
      .createQueryBuilder("ss")
      .leftJoin("ss.student", "student")
      .select([
        "student.fullName AS studentName",
        "ss.stage AS stage",
        "ss.status AS status"
      ])
      .getRawMany();
  }

  // 👨‍🏫 Mentor Allocation Report
  async getMentorAllocationReport() {
    return await this.mentorAllocRepo
      .createQueryBuilder("alloc")
      .leftJoin("alloc.mentor", "mentor")
      .select([
        "mentor.fullName AS mentorName",
        "COUNT(alloc.studentId) AS studentsAssigned"
      ])
      .groupBy("mentor.fullName")
      .getRawMany();
  }
}
