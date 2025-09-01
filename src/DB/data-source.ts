import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { User } from "@app/entity/User"
import { UserRole } from "@app/entity/UserRole"
import { EventApplication } from "@app/entity/EventApplication"
import { StudentProfile } from "@app/entity/StudentProfile"
import { ProgressLog } from "@app/entity/ProcessLog"
import { MentorAllocation } from "@app/entity/MentorAllocation"
import { Event } from "@app/entity/Event"
import { Notification } from "@app/entity/Notifications"
import { Role } from "@app/entity/Role"
import { RolePermission } from "@app/entity/RolePermissions"
import { Permission } from "@app/entity/Permissions"
dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User,
        Role,
        UserRole,
        EventApplication,
        StudentProfile,
        ProgressLog,
        MentorAllocation,
        Event,
        Notification,
        RolePermission,
        Permission],
    synchronize: true,
    logging: false,
})

