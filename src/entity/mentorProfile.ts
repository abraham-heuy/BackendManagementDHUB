// src/entity/MentorProfile.ts
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
  
  @Entity("mentor_profiles")
  export class MentorProfile {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @OneToOne(() => User, (user) => user.mentorProfile, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;
  
    @Column({ type: "text", nullable: true })
    specialization?: string;
  
    @Column({ type: "text", nullable: true })
    experience?: string;
  
    @Column({ type: "text", nullable: true })
    recentProject?: string;
  
    @Column({ type: "varchar", nullable: true })
    contact?: string;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }