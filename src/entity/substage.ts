import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Stage } from "./stage";
import { User } from "./User";

@Entity("substages")
export class SubStage extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  substage_id!: string;

  @Column()
  name!: string; // e.g. "Ideation", "Prototype", "Validation"

  @Column({ type: "int" })
  order!: number;

  @Column({ type: "float", default: 0 })
  weightScore!: number; // Weighted value of this substage

  @ManyToOne(() => Stage, (stage) => stage.substages, { onDelete: "CASCADE" })
  stage!: Stage;

  @ManyToOne(() => User, { eager: true })
  createdBy!: User; // Who created the substage

  @Column({
    type: "enum",
    enum: ["active", "inactive"],
    default: "active",
  })
  status!: "active" | "inactive"; // To control visibility / activation

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
