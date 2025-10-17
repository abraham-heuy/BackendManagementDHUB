// src/entity/Event.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { EventApplication } from "./EventApplication";
import { Role } from "./Role";
import { Stage } from "./stage";

export enum EventCategory {
  HACKATHON = "hackathon",
  WORKSHOP = "workshop",
  SEMINAR = "seminar",
  TRAINING = "training",
  OTHER = "other",
}

// ✅ Audience types
export enum TargetAudience {
  EVERYONE = "everyone", // visible to all (even guests)
  REGISTERED = "registered", // all logged-in users
  ROLE = "role", // specific role only
  STAGE = "stage", // specific stage only
}

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  location!: string;

  @Column({ type: "text", nullable: true })
  objective!: string;

  @Column({ type: "date" })
  date!: Date;

  @Column({ type: "time", nullable: true })
  timeFrom!: string;

  @Column({ type: "time", nullable: true })
  timeTo!: string;

  @Column({ type: "text", nullable: true })
  details!: string;

  // ✅ Event Category
  @Column({
    type: "enum",
    enum: EventCategory,
    default: EventCategory.OTHER,
  })
  category!: EventCategory;

  // ✅ Created by user
  @ManyToOne(() => User, (user) => user.createdEvents, {
    nullable: true,
    onDelete: "SET NULL",
  })
  createdBy!: User | null;

  // ✅ Who can access this event
  @Column({
    type: "enum",
    enum: TargetAudience,
    default: TargetAudience.EVERYONE,
  })
  targetAudience!: TargetAudience;

  // ✅ Optional role-based visibility (if audience is ROLE)
  @ManyToOne(() => Role, { nullable: true, onDelete: "SET NULL" })
  targetRole!: Role | null;

  // ✅ Optional stage-based visibility (if audience is STAGE)
  @ManyToOne(() => Stage, { nullable: true, onDelete: "SET NULL" })
  targetStage!: Stage | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => EventApplication, (application) => application.event, {
    cascade: true,
  })
  applications!: EventApplication[];
}
