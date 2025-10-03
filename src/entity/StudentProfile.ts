// src/entity/StudentProfile.ts
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

@Entity("student_profiles")
export class StudentProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

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

  //  column for matching with mentor specialization .. added it for the allocation mapping;{eg, IT, ML, Engineering, Maths}
  @Column({ nullable: true })
  field?: string;

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