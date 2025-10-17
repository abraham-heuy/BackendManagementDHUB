import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./User";
import { Startup } from "./startup";
import { SubStage } from "./substage";

@Entity("startup_progress")
export class StartupProgress extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Startup, (startup) => startup.progressHistory, { onDelete: "CASCADE" })
  startup!: Startup;

  @ManyToOne(() => SubStage, { eager: true })
  subStage!: SubStage;

  @ManyToOne(() => User, { eager: true })
  reviewedBy!: User; // Admin or mentor approving

  @Column({ type: "float" })
  scoreAwarded!: number;

  @Column({ type: "text", nullable: true })
  comment?: string | null;

  @Column({
    type: "enum",
    enum: ["pending", "submitted", "approved", "rejected"],
    default: "pending",
  })
  status!: "pending" | "submitted" | "approved" | "rejected"; // Tracks workflow

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
