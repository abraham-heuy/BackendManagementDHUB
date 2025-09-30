import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

/**
 * Notification types (matches UI: Alert | Update | Warning)
 */
export enum NotificationType {
  ALERT = "alert",
  WARNING = "warning",
  UPDATE = "update",
}

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // recipient (keeps compatibility with User.notifications relation)
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: "CASCADE" })
  user!: User;

  // optional sender (admin, mentor, or the student who triggered it)
  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  sender?: User | null;

  // message body (stored for profile notifications)
  @Column({ type: "text" })
  message!: string;

  // type for categorization in UI (alert / warning / update)
  @Column({ type: "enum", enum: NotificationType, default: NotificationType.UPDATE })
  type!: NotificationType;

  // per-user read flag
  @Column({ default: false })
  is_read!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}
