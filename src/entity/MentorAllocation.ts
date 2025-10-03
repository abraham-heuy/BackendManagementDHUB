// src/entity/MentorAllocation.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("mentor_allocations")
export class MentorAllocation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (u) => u.mentorAllocationsAsMentor, { onDelete: "CASCADE" })
  mentor!: User;

  @ManyToOne(() => User, (u) => u.mentorAllocationsAsStudent, { onDelete: "CASCADE" })
  student!: User;

  @CreateDateColumn()
  created_at!: Date;
}