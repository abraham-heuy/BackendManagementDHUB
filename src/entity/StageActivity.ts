// src/entity/StageActivity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Stage } from "./stage";

export type ActivityType = "reading" | "video" | "quiz" | "assignment" | "task";

@Entity("stage_activities")
export class StageActivity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // which stage this activity belongs to (enum)
  @Column({ type: "enum", enum: Stage })
  stage!: Stage;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 50, default: "task" })
  activityType!: ActivityType;

  @Column({ type: "boolean", default: true })
  required!: boolean;

  // weight contribution to stage completion (0-100)
  @Column({ type: "int", default: 0 })
  weight!: number;

  @Column({ type: "int", default: 0 })
  ordering!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
