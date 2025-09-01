// src/entities/Notification.ts
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, CreateDateColumn
  } from "typeorm";
  import { User } from "@app/entity/User";
  
  @Entity("notifications")
  export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @ManyToOne(() => User, (user) => user.notifications, { onDelete: "CASCADE" })
    user!: User;
  
    @Column({ type: "text" })
    message!: string;
  
    @Column({ default: "info" })
    type!: "info" | "alert" | "update";
  
    @Column({ default: false })
    is_read!: boolean;
  
    @CreateDateColumn()
    created_at!: Date;
  }
  