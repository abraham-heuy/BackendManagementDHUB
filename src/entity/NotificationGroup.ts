import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";

/**
 * Notification groups are named groups of users (e.g. "Pre-Incubation", "Batch 2025")
 * Admin can pick a group and broadcast a notification to all members.
 */
@Entity("notification_groups")
export class NotificationGroup {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  // many-to-many members, stored in join table notification_group_members
  @ManyToMany(() => User)
  @JoinTable({ name: "notification_group_members" })
  members!: User[];
}
