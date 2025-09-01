// permissions entity
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Unique,
  } from "typeorm";
  import { RolePermission } from "@app/entity/RolePermissions";
  
  @Entity("permissions")
  @Unique(["action", "resource"])
  export class Permission {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    action!: string; // create, read, update, delete
  
    @Column()
    resource!: string; // event, profile, progress
  
    @OneToMany(() => RolePermission, (rp) => rp.permission)
    rolePermissions!: RolePermission[];
  }
  