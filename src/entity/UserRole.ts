// the user roe entity:
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Unique,
  } from "typeorm";
  import { User } from "@app/entity/User";
  import { Role } from "@app/entity/Role";
  
  @Entity("user_roles")
  @Unique(["user", "role"])
  export class UserRole {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => User, (user) => user.userRoles, { onDelete: "CASCADE" })
    user!: User;
  
    @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: "CASCADE" })
    role!: Role;
  }
  