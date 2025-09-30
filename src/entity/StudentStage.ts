// src/entity/StudentStage.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Stage } from "./stage";
import { StudentActivity } from "./StudentActivity";

export enum StudentStageStatus {
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  LOCKED = "locked",
}

@Entity("student_stages")
export class StudentStage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (u) => u.studentStages, { onDelete: "CASCADE" })
  student!: User;

  @Column({ type: "enum", enum: Stage })
  stage!: Stage;

  @Column({
    type: "enum",
    enum: StudentStageStatus,
    default: StudentStageStatus.IN_PROGRESS,
  })
  status!: StudentStageStatus;

  @Column({ type: "int", default: 0 })
  progressPercent!: number;

  @CreateDateColumn()
  started_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  completed_at?: Date;

  @OneToMany(() => StudentActivity, (a) => a.studentStage, { cascade: true })
  activities!: StudentActivity[];

  @UpdateDateColumn()
  updated_at!: Date;
}
