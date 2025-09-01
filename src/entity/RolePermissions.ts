// role permissionns entity
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Unique,
  } from "typeorm";
  import { Role } from "@app/entity/Role";
  import { Permission } from "@app/entity/Permissions";
  
  @Entity("role_permissions")
  @Unique(["role", "permission"])
  export class RolePermission {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: "CASCADE" })
    role!: Role;
  
    @ManyToOne(() => Permission, (perm) => perm.rolePermissions, { onDelete: "CASCADE" })
    permission!: Permission;
  }
  