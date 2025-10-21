// src/entity/MenteeProfile.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("mentee_profiles")
export class MenteeProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => User, (user) => user.menteeProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  // NEW: mentee category (e.g., Student, Innovator, Entrepreneur, Graduate)
  @Column({ nullable: true })
  category?: string;

  @Column({ type: "text", nullable: true })
  bio?: string;

  @Column({ type: "text", array: true, nullable: true })
  skills?: string[];

  @Column({ type: "text", nullable: true })
  startup_idea?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  institution?: string;

  @Column({ nullable: true })
  field?: string; // area of focus for matching

  @Column({ nullable: true })
  course?: string;

  @Column({ nullable: true })
  yearOfStudy?: string;

  @Column({ nullable: true })
  linkedIn?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  resumeUrl?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
