// src/entity/StudentActivity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { StudentStage } from "./StudentStage";
import { StageActivity } from "./StageActivity";

export enum StudentActivityStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  SUBMITTED = "submitted",
}

@Entity("student_activities")
export class StudentActivity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => StudentStage, (ss) => ss.activities, { onDelete: "CASCADE" })
  studentStage!: StudentStage;

  @ManyToOne(() => StageActivity, { eager: true })
  activity!: StageActivity;

  @Column({
    type: "enum",
    enum: StudentActivityStatus,
    default: StudentActivityStatus.NOT_STARTED,
  })
  status!: StudentActivityStatus;

  @Column({ type: "int", nullable: true })
  score?: number;

  @Column({ type: "text", nullable: true })
  submissionUrl?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
