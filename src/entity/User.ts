// src/entities/User.ts
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
import { Role } from "@app/entity/Role";
import { StudentProfile } from "@app/entity/StudentProfile";
import { MentorAllocation } from "@app/entity/MentorAllocation";
import { Event } from "@app/entity/Event";
import { Notification } from "@app/entity/Notifications";
import { Stage } from "./stage";
import { ProgressLog } from "./ProcessLog";

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

  // Optional for students only
  @Column({ nullable: true })
  regNumber?: string;

  // Stage field for students
  @Column({
    type: "enum",
    enum: Stage,
    nullable: true, // Admins/mentors don’t need a stage
  })
  stage?: Stage;

  // Foreign key to Role
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: "role_id" })
  role!: Role;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @OneToMany(() => Event, (event) => event.createdBy)
  createdEvents!: Event[];

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
