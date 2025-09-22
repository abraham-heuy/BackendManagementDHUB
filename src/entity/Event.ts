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

export enum EventCategory {
  HACKATHON = "hackathon",
  WORKSHOP = "workshop",
  SEMINAR = "seminar",
  TRAINING = "training",
  OTHER = "other",
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

  @ManyToOne(() => User, (user) => user.createdEvents, {
    nullable: true,
    onDelete: "SET NULL",
  })
  createdBy!: User | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => EventApplication, (application) => application.event, {
    cascade: true,
  })
  applications!: EventApplication[];
}
