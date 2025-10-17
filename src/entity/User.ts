import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Role } from "./Role";
import { MentorAllocation } from "./MentorAllocation";
import { Event } from "./Event";
import { EventApplication } from "./EventApplication";
import { Notification } from "./Notifications";
import { MenteeProfile } from "./menteeProfile";
import { MentorProfile } from "./mentorProfile";
import { Stage } from "./stage";
import { Startup } from "./startup";
import { StartupProgress } from "./startupActivity";


@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  regNumber?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  currentProject?: string;

  // ========== Relationships ==========

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "role_id" })
  role?: Role | null;

  // User’s current stage (optional — program-level)
  @ManyToOne(() => Stage, (stage) => stage.users, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "stage_id" })
  stage?: Stage | null;

  // User as founder in one or more startups
  @OneToMany(() => Startup, (startup) => startup.founder)
  startups!: Startup[];

  // If user acts as admin or reviewer for startup progress
  @OneToMany(() => StartupProgress, (progress) => progress.reviewedBy)
  reviewedProgressRecords!: StartupProgress[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // ========== One-to-Many / One-to-One relations ==========

  @OneToMany(() => Event, (event) => event.createdBy)
  createdEvents!: Event[];

  @OneToMany(() => EventApplication, (app) => app.student)
  applications!: EventApplication[];

  @OneToOne(() => MenteeProfile, (profile) => profile.user)
  menteeProfile!: MenteeProfile;

  @OneToOne(() => MentorProfile, (profile) => profile.user)
  mentorProfile!: MentorProfile;

  @OneToMany(() => MentorAllocation, (alloc) => alloc.student)
  mentorAllocationsAsStudent!: MentorAllocation[];

  @OneToMany(() => MentorAllocation, (alloc) => alloc.mentor)
  mentorAllocationsAsMentor!: MentorAllocation[];

  @OneToMany(() => Notification, (notif) => notif.user)
  notifications!: Notification[];
}
