import { MigrationInterface, QueryRunner } from "typeorm";

export class UserMigration1759183359500 implements MigrationInterface {
    name = 'UserMigration1759183359500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."stage_activities_stage_enum" AS ENUM('pre-incubation', 'incubation', 'startup', 'alumni')`);
        await queryRunner.query(`CREATE TABLE "stage_activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stage" "public"."stage_activities_stage_enum" NOT NULL, "title" character varying NOT NULL, "description" text, "activityType" character varying(50) NOT NULL DEFAULT 'task', "required" boolean NOT NULL DEFAULT true, "weight" integer NOT NULL DEFAULT '0', "ordering" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b8c86d418a59375e68aff7c646d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."student_activities_status_enum" AS ENUM('not_started', 'in_progress', 'completed', 'submitted')`);
        await queryRunner.query(`CREATE TABLE "student_activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."student_activities_status_enum" NOT NULL DEFAULT 'not_started', "score" integer, "submissionUrl" text, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "studentStageId" uuid, "activityId" uuid, CONSTRAINT "PK_80a8750814db6b79db305c18641" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."student_stages_stage_enum" AS ENUM('pre-incubation', 'incubation', 'startup', 'alumni')`);
        await queryRunner.query(`CREATE TYPE "public"."student_stages_status_enum" AS ENUM('in_progress', 'completed', 'locked')`);
        await queryRunner.query(`CREATE TABLE "student_stages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stage" "public"."student_stages_stage_enum" NOT NULL, "status" "public"."student_stages_status_enum" NOT NULL DEFAULT 'in_progress', "progressPercent" integer NOT NULL DEFAULT '0', "started_at" TIMESTAMP NOT NULL DEFAULT now(), "completed_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "studentId" uuid, CONSTRAINT "PK_eb30535080f3ae71294301e922e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP COLUMN "stage"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD "institution" character varying`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD "course" character varying`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD "yearOfStudy" character varying`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD "linkedIn" character varying`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD "website" character varying`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD "resumeUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "studentId" uuid`);
        await queryRunner.query(`ALTER TABLE "progress_logs" ADD "progressPercent" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "progress_logs" ADD "milestone" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "progress_logs" ADD "notes" text`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "stage" SET DEFAULT 'pre-incubation'`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD CONSTRAINT "FK_931f579420077e8fb42628b5200" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_activities" ADD CONSTRAINT "FK_361b21f899e567093adfcc67b4d" FOREIGN KEY ("studentStageId") REFERENCES "student_stages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_activities" ADD CONSTRAINT "FK_011f0942ff2a749ad8fc18f1c66" FOREIGN KEY ("activityId") REFERENCES "stage_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_stages" ADD CONSTRAINT "FK_c1343782a2c15f6ed364c918fd4" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_stages" DROP CONSTRAINT "FK_c1343782a2c15f6ed364c918fd4"`);
        await queryRunner.query(`ALTER TABLE "student_activities" DROP CONSTRAINT "FK_011f0942ff2a749ad8fc18f1c66"`);
        await queryRunner.query(`ALTER TABLE "student_activities" DROP CONSTRAINT "FK_361b21f899e567093adfcc67b4d"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP CONSTRAINT "FK_931f579420077e8fb42628b5200"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "stage" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "progress_logs" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "progress_logs" DROP COLUMN "milestone"`);
        await queryRunner.query(`ALTER TABLE "progress_logs" DROP COLUMN "progressPercent"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "studentId"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP COLUMN "resumeUrl"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP COLUMN "linkedIn"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP COLUMN "yearOfStudy"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP COLUMN "course"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP COLUMN "institution"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD "stage" character varying NOT NULL DEFAULT 'pre-incubation'`);
        await queryRunner.query(`DROP TABLE "student_stages"`);
        await queryRunner.query(`DROP TYPE "public"."student_stages_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."student_stages_stage_enum"`);
        await queryRunner.query(`DROP TABLE "student_activities"`);
        await queryRunner.query(`DROP TYPE "public"."student_activities_status_enum"`);
        await queryRunner.query(`DROP TABLE "stage_activities"`);
        await queryRunner.query(`DROP TYPE "public"."stage_activities_stage_enum"`);
    }

}
