// src/entity/EventApplication.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Event } from "./Event";

@Entity("event_applications")
export class EventApplication {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  regNo!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({ type: "text", nullable: true })
  teamMembers!: string;

  @Column({ type: "text" })
  businessIdea!: string;

  @Column({ type: "text" })
  problemStatement!: string;

  @Column({ type: "text" })
  solution!: string;

  @Column({ type: "text" })
  targetMarket!: string;

  @Column({ type: "text" })
  revenueModel!: string;

  @Column({ default: false })
  isPassed!: boolean; // ✅ admin later marks pass/fail

  @ManyToOne(() => Event, (event) => event.applications, {
    onDelete: "CASCADE",
  })
  event!: Event;

  @CreateDateColumn()
  appliedAt!: Date;
}
