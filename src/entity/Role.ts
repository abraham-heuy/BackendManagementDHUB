// te role entity:
// src/entities/Role.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from "typeorm";
  import { UserRole } from "@app/entity/UserRole";
  import { RolePermission } from "@app/entity/RolePermissions";
  
  @Entity("roles")
  export class Role {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ unique: true })
    name!: string; // admin, student, mentor
  
    @Column({ nullable: true })
    description!: string;
  
    @OneToMany(() => UserRole, (userRole) => userRole.role)
    userRoles!: UserRole[];
  
    @OneToMany(() => RolePermission, (rp) => rp.role)
    rolePermissions!: RolePermission[];
  }
  