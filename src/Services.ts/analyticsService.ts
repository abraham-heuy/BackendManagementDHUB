// src/Services.ts/analyticsService.ts
import { AppDataSource } from "@app/DB/data-source";
import { Between } from "typeorm";
import { User } from "@app/entity/User";
import { Role } from "@app/entity/Role";

import { Event } from "@app/entity/Event";
import { EventApplication } from "@app/entity/EventApplication";
import { MentorProfile } from "@app/entity/mentorProfile";
import { MentorAllocation } from "@app/entity/MentorAllocation";
import { Notification } from "@app/entity/Notifications";

export class AnalyticsService {
  private userRepo = AppDataSource.getRepository(User);
  private roleRepo = AppDataSource.getRepository(Role);

  private eventRepo = AppDataSource.getRepository(Event);
  private eventAppRepo = AppDataSource.getRepository(EventApplication);
  private mentorProfileRepo = AppDataSource.getRepository(MentorProfile);
  private mentorAllocationRepo = AppDataSource.getRepository(MentorAllocation);
  private notificationRepo = AppDataSource.getRepository(Notification);

  // 👥 USERS
  async getUserStats(userId: string) {
    const totalUsers = await this.userRepo.count();

    const usersByRole = await this.userRepo
      .createQueryBuilder("user")
      .leftJoin("user.role", "role")
      .select("role.name", "role")
      .addSelect("COUNT(user.id)", "count")
      .groupBy("role.name")
      .getRawMany();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newRegistrations = await this.userRepo.count({
      where: { created_at: Between(oneWeekAgo, new Date()) },
    });

    return { totalUsers, usersByRole, newRegistrations, requestedBy: userId };
  }

  // // 🎓 STAGES & PROGRESS
  // async getStageProgressStats(userId: string) {
  //   const totalStudentStages = await this.studentStageRepo.count();

  //   const stageDistribution = await this.studentStageRepo
  //     .createQueryBuilder("ss")
  //     .select("ss.stage", "stage")
  //     .addSelect("COUNT(ss.id)", "count")
  //     .groupBy("ss.stage")
  //     .getRawMany();

  //   const completionRates = await this.studentStageRepo
  //     .createQueryBuilder("ss")
  //     .select("ss.stage", "stage")
  //     .addSelect(
  //       `ROUND(AVG(CASE WHEN ss.status = 'completed' THEN 100 ELSE ss.progressPercent END), 2)`,
  //       "averageProgress"
  //     )
  //     .groupBy("ss.stage")
  //     .getRawMany();

  //   const avgActivityCompletion = await this.studentActivityRepo
  //     .createQueryBuilder("sa")
  //     .select("sa.status", "status")
  //     .addSelect("COUNT(sa.id)", "count")
  //     .groupBy("sa.status")
  //     .getRawMany();

  //   return {
  //     totalStudentStages,
  //     stageDistribution,
  //     completionRates,
  //     avgActivityCompletion,
  //     requestedBy: userId,
  //   };
  // }

  // 🧩 EVENTS & APPLICATIONS
  async getEventStats(userId: string) {
    const totalEvents = await this.eventRepo.count();
    const totalApplications = await this.eventAppRepo.count();

    const eventsByCategory = await this.eventRepo
      .createQueryBuilder("e")
      .select("e.category", "category")
      .addSelect("COUNT(e.id)", "count")
      .groupBy("e.category")
      .getRawMany();

    const applicationStatus = await this.eventAppRepo
      .createQueryBuilder("ea")
      .select("ea.isPassed", "isPassed")
      .addSelect("COUNT(ea.id)", "count")
      .groupBy("ea.isPassed")
      .getRawMany();

    return {
      totalEvents,
      totalApplications,
      eventsByCategory,
      applicationStatus,
      requestedBy: userId,
    };
  }

  // 👨‍🏫 MENTORSHIP
  async getMentorshipStats(userId: string) {
    const totalMentors = await this.mentorProfileRepo.count();
    const totalAllocations = await this.mentorAllocationRepo.count();

    const mentorStudentRatio =
      totalMentors > 0 ? (totalAllocations / totalMentors).toFixed(2) : "0";

    return { totalMentors, totalAllocations, mentorStudentRatio, requestedBy: userId };
  }

  // 🔔 NOTIFICATIONS
  async getNotificationStats(userId: string) {
    const totalNotifications = await this.notificationRepo.count();

    const recentNotifications = await this.notificationRepo
      .createQueryBuilder("n")
      .select("COUNT(n.id)", "count")
      .addSelect("DATE_TRUNC('day', n.created_at)", "date")
      .groupBy("DATE_TRUNC('day', n.created_at)")
      .orderBy("date", "DESC")
      .limit(7)
      .getRawMany();

    return { totalNotifications, recentNotifications, requestedBy: userId };
  }

  // 📊 DASHBOARD SUMMARY
  async getDashboardSummary(userId: string) {
    const [users, stages, events, mentors] = await Promise.all([
      this.getUserStats(userId),
      // this.getStageProgressStats(userId),
      this.getEventStats(userId),
      this.getMentorshipStats(userId),
      this.getNotificationStats(userId),
    ]);

    return { users, stages, events, mentors, requestedBy: userId };
  }
}
