//the user entity for auth: 
// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne
} from "typeorm";
import { UserRole } from "@app/entity/UserRole";
import { EventApplication } from "@app/entity/EventApplication";
import { StudentProfile } from "@app/entity/StudentProfile";
import { ProgressLog } from "@app/entity/ProcessLog";
import { MentorAllocation } from "@app/entity/MentorAllocation";
import { Event } from "@app/entity/Event";
import { Notification } from "@app/entity/Notifications";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string; // hashed

  @Column()
  fullName!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles!: UserRole[];

  @OneToMany(() => Event, (event) => event.createdBy)
  createdEvents!: Event[];
  

  @OneToMany(() => EventApplication, (application) => application.student)
  applications!: EventApplication[];

  @OneToOne(() => StudentProfile, (profile) => profile.user)
  profile!: StudentProfile;

  @OneToMany(() => ProgressLog, (log) => log.student)
  progressLogs!: ProgressLog[];

  @OneToMany(() => MentorAllocation, (allocation) => allocation.student)
  mentorAllocationsAsStudent!: MentorAllocation[];

  @OneToMany(() => MentorAllocation, (allocation) => allocation.mentor)
  mentorAllocationsAsMentor!: MentorAllocation[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

}
