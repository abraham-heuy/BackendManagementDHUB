import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { SubStage } from "./substage";
import { User } from "./User";
  
  @Entity("stages")
  export class Stage extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    stage_id!: string;
  
    @Column({ unique: true })
    name!: string; // e.g. "Pre-incubation", "Incubation"
  
    @Column({ type: "int" })
    order!: number; // progression order (1, 2, 3)
  
    @OneToMany(() => SubStage, (sub) => sub.stage, { cascade: true })
    substages!: SubStage[];
  
    // ✅ Add this relation
    @OneToMany(() => User, (user) => user.stage)
    users!: User[];
    
    @ManyToOne(() => User, { eager: true })
    createdBy!: User; // Who created the stage
    

     @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }
  