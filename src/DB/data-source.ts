import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { User } from "@app/entity/User"
import { EventApplication } from "@app/entity/EventApplication"
import { StudentProfile } from "@app/entity/StudentProfile"
import { ProgressLog } from "@app/entity/ProcessLog"
import { MentorAllocation } from "@app/entity/MentorAllocation"
import { Event } from "@app/entity/Event"
import { Notification } from "@app/entity/Notifications"
import { Role } from "@app/entity/Role"
import { StudentActivity } from "@app/entity/StudentActivity"
import { StudentStage } from "@app/entity/StudentStage"
import { StageActivity } from "@app/entity/StageActivity"
import { NotificationGroup } from "@app/entity/NotificationGroup"
import { MentorProfile } from "@app/entity/mentorProfile"
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
        EventApplication,
        StudentProfile,
        ProgressLog,
        MentorAllocation,
        Event,
        Notification,
        StudentActivity,
        StudentStage,
        StageActivity,
        NotificationGroup,
        MentorProfile
    ],
    migrations: ["src/migrations/*.ts"],
    synchronize: false,
    logging: false,
})

