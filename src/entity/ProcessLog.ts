// src/entities/ProgressLog.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "@app/entity/User";
import { Stage } from "@app/entity/stage";

@Entity("progress_logs")
export class ProgressLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.progressLogs, { onDelete: "CASCADE" })
  student!: User;

  @Column({ type: "enum", enum: Stage, nullable: true })
  old_stage!: Stage | null;

  @Column({ type: "enum", enum: Stage })
  new_stage!: Stage;

  @Column({ type: "int", default: 0 })
  progressPercent!: number; // ✅ Track percentage progress

  @Column({ type: "varchar", length: 255, nullable: true })
  milestone?: string; // ✅ Short milestone description

  @Column({ type: "text", nullable: true })
  notes?: string; // ✅ Optional notes by admin/mentor

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  updated_by!: User | null;

  @CreateDateColumn()
  updated_at!: Date;
}
