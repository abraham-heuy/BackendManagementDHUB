import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { User } from "@app/entity/User"
import { EventApplication } from "@app/entity/EventApplication"
import { MentorAllocation } from "@app/entity/MentorAllocation"
import { Event } from "@app/entity/Event"
import { Notification } from "@app/entity/Notifications"
import { Role } from "@app/entity/Role"
import { NotificationGroup } from "@app/entity/NotificationGroup"
import { MentorProfile } from "@app/entity/mentorProfile"
import { MenteeProfile } from "@app/entity/menteeProfile"
import { Stage } from "@app/entity/stage"
import { SubStage } from "@app/entity/substage"
import { Startup } from "@app/entity/startup"
import { StartupProgress } from "@app/entity/startupActivity"
import { Applications } from "@app/entity/pitching_applications"
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
        MenteeProfile,
        MentorAllocation,
        Event,
        Notification,
        NotificationGroup,
        MentorProfile,
        Stage,
        SubStage,
        Startup,
        StartupProgress,
        Applications
        
    ],
    migrations: ["src/migrations/*.ts"],
    synchronize: false,
    logging: false,
})

