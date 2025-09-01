// src/entities/StudentProfile.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn
  } from "typeorm";
  import { User } from "@app/entity/User";
  
  @Entity("student_profiles")
  export class StudentProfile {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;
  
    @Column({ type: "text", nullable: true })
    bio!: string;
  
    @Column({ type: "text", array: true, nullable: true })
    skills!: string[];
  
    @Column({ type: "text", nullable: true })
    startup_idea!: string;
  
    @Column({ default: "pre-incubation" })
    stage!: "pre-incubation" | "incubation" | "startup";
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  