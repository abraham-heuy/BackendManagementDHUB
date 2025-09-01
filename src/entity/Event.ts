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
  import { EventApplication } from "./EventApplication";
  
  @Entity("events")
  export class Event {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column()
    title!: string;
  
    @Column({ type: "text", nullable: true })
    description!: string;
  
    @Column({ type: "timestamp" })
    start_date!: Date;
  
    @Column({ type: "timestamp" })
    end_date!: Date;
  
    
    @ManyToOne(() => User, (user) => user.createdEvents, {
      nullable: true,
      onDelete: "SET NULL",
    })
    createdBy!: User | null;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    @OneToMany(() => EventApplication, (application) => application.event)
    applications!: EventApplication[];
  }
  