// src/entities/MentorAllocation.ts
import {
    Entity, PrimaryGeneratedColumn, ManyToOne,
    CreateDateColumn, Unique
  } from "typeorm";
  import { User } from "@app/entity/User";
  
  @Entity("mentor_allocations")
  @Unique(["student", "mentor"])
  export class MentorAllocation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @ManyToOne(() => User, (user) => user.mentorAllocationsAsStudent, { onDelete: "CASCADE" })
    student!: User;
  
    @ManyToOne(() => User, (user) => user.mentorAllocationsAsMentor, { onDelete: "CASCADE" })
    mentor!: User;
  
    @CreateDateColumn()
    allocated_at!: Date;
  }
  