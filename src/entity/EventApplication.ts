// src/entities/EventApplication.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn, Unique
  } from "typeorm";
  import { User } from "@app/entity/User";
  import { Event } from "@app/entity/Event";
  
  @Entity("event_applications")
  @Unique(["event", "student"])
  export class EventApplication {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @ManyToOne(() => Event, (event) => event.applications, { onDelete: "CASCADE" })
    event!: Event;
  
    @ManyToOne(() => User, (user) => user.applications, { onDelete: "CASCADE" })
    student!: User;
  
    @Column({ default: "pending" })
    status!: "pending" | "approved" | "rejected";
  
    @CreateDateColumn()
    applied_at!: Date;
  }
  