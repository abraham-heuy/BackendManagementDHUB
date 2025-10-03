// src/entities/Role.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "@app/entity/User";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string; // "admin", "student", "mentor"

  @Column({ nullable: true })
  description?: string;

  // One role can be assigned to many users
  @OneToMany(() => User, (user) => user.role)
  users!: User[];


}
