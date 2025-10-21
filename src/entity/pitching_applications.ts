import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Startup } from "./startup";

@Entity("pitching_applications")
export class Applications extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  application_id!: string; // now a UUID, not a number

  @Column({ nullable: true })
  regNo?: string;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  surname?: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column("text", { array: true, default: () => "ARRAY[]::text[]" })
  teamMembers!: string[];

  @Column("text")
  businessIdea!: string;

  @Column("text")
  problemStatement!: string;

  @Column("text")
  solution!: string;

  @Column("text")
  targetMarket!: string;

  @Column("text")
  revenueModel!: string;

  @Column({
    type: "enum",
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  })
  status!: "pending" | "approved" | "rejected";

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToOne(() => Startup, (startup) => startup.application, { cascade: true })
  @JoinColumn({ name: "startup_id" })
  startup!: Startup;
}
