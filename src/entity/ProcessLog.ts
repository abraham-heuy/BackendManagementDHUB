// src/entities/ProgressLog.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn
  } from "typeorm";
  import { User } from "@app/entity/User";
  
  @Entity("progress_logs")
  export class ProgressLog {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @ManyToOne(() => User, (user) => user.progressLogs, { onDelete: "CASCADE" })
    student!: User;
  
    @Column({ nullable: true })
    old_stage!: string;
  
    @Column()
    new_stage!: string;
  
    @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
    updated_by!: User | null;
  
    @CreateDateColumn()
    updated_at!: Date;
  }
  