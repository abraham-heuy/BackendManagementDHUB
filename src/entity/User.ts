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
import { StudentProfile } from "./StudentProfile";
import { MentorAllocation } from "./MentorAllocation";
import { Event } from "./Event";
import { EventApplication } from "./EventApplication";
import { Stage } from "./stage";
import { ProgressLog } from "./ProcessLog";
import { StudentStage } from "./StudentStage";
import { Notification } from "./Notifications";

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

  @Column({ nullable: true })
  regNumber?: string;

  // default to PRE_INCUBATION for new students; nullable so admins/mentors can omit
  @Column({
    type: "enum",
    enum: Stage,
    nullable: true,
    default: Stage.PRE_INCUBATION,
  })
  stage?: Stage | null;

  // Role FK (admin, student, mentor, etc.)
  @ManyToOne(() => Role, (role) => role.users, { eager: true, nullable: true })
  @JoinColumn({ name: "role_id" })
  role?: Role | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @OneToMany(() => Event, (event) => event.createdBy)
  createdEvents!: Event[];

  // Optional: applications by registered users (event applications can also be anonymous)
  @OneToMany(() => EventApplication, (app) => app.student)
  applications!: EventApplication[];

  @OneToOne(() => StudentProfile, (profile) => profile.user)
  profile!: StudentProfile;

  @OneToMany(() => ProgressLog, (log) => log.student)
  progressLogs!: ProgressLog[];

  @OneToMany(() => MentorAllocation, (alloc) => alloc.student)
  mentorAllocationsAsStudent!: MentorAllocation[];

  @OneToMany(() => MentorAllocation, (alloc) => alloc.mentor)
  mentorAllocationsAsMentor!: MentorAllocation[];

  // Student-stage instances (history / current)
  @OneToMany(() => StudentStage, (ss) => ss.student)
  studentStages!: StudentStage[];

  @OneToMany(() => Notification, (notif) => notif.user)
  notifications!: Notification[];
}
