import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { User } from "./User";
  import { Stage } from "./stage";
  import { SubStage } from "./substage";
import { StartupProgress } from "./startupActivity";
import { Applications } from "./pitching_applications";
  
  @Entity("startups")
  export class Startup extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    startup_id!: string;
  
    @OneToOne(() => Applications, (app) => app.startup, { eager: true })
    @JoinColumn({ name: "application_id" })
    application!: Applications;
  
    @ManyToOne(() => User, (user) => user.startups, { eager: true })
    @JoinColumn({ name: "founder_id" })
    founder!: User;
  
    @Column({ length: 150 })
    title!: string;
  
    @Column("text")
    description!: string;
  
    @ManyToOne(() => Stage, { eager: true })
    @JoinColumn({ name: "stage_id" })
    currentStage!: Stage;
  
    @ManyToOne(() => SubStage, { eager: true, nullable: true })
    @JoinColumn({ name: "sub_stage_id" })
    currentSubStage!: SubStage | null;
  
    @Column({
      type: "enum",
      enum: ["active", "graduated", "suspended"],
      default: "active",
    })
    status!: "active" | "graduated" | "suspended";
  
    @Column({ type: "float", default: 0 })
    cumulativeScore!: number;
  
    @Column({ type: "text", nullable: true })
    adminComment?: string;
  
    @Column({ type: "date", nullable: true })
    graduationDate?: Date;
  
    @Column("text", { array: true, default: () => "ARRAY[]::text[]" })
    teamMembers!: string[];
  
    // ✅ Add this relation
    @OneToMany(() => StartupProgress, (progress) => progress.startup, { cascade: true })
    progressHistory!: StartupProgress[];
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }
  