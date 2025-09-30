import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Stage } from "./stage";

@Entity("progress_logs")
export class ProgressLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // the student whose stage/progress changed
  @ManyToOne(() => User, (user) => user.progressLogs, { onDelete: "CASCADE" })
  student!: User;

  @Column({ type: "enum", enum: Stage, nullable: true })
  old_stage!: Stage | null;

  @Column({ type: "enum", enum: Stage })
  new_stage!: Stage;

  // percent progress snapshot (useful for non-stage-change logs)
  @Column({ type: "int", default: 0 })
  progressPercent!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  milestone?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  // who performed the change (admin/mentor)
  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  updated_by!: User | null;

  @CreateDateColumn()
  updated_at!: Date;
}


/**
 * Keeps history of stage promotions and progress updates (who and when), 
 * includes percentage and notes for audit and reporting.
 */