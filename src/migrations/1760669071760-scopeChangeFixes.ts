import { MigrationInterface, QueryRunner } from "typeorm";

export class ScopeChangeFixes1760669071760 implements MigrationInterface {
    name = 'ScopeChangeFixes1760669071760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`CREATE TYPE "public"."substages_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "substages" ("substage_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "order" integer NOT NULL, "weightScore" double precision NOT NULL DEFAULT '0', "status" "public"."substages_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "stageStageId" uuid, "createdById" uuid, CONSTRAINT "PK_02235733da7c52bdfab9e81d0e2" PRIMARY KEY ("substage_id"))`);
        await queryRunner.query(`CREATE TABLE "stages" ("stage_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "order" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid, CONSTRAINT "UQ_62914e6926ccc4850911e89ee1a" UNIQUE ("name"), CONSTRAINT "PK_4cd030b35a4074cafafdb57b931" PRIMARY KEY ("stage_id"))`);
        await queryRunner.query(`CREATE TABLE "mentee_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying, "bio" text, "skills" text array, "startup_idea" text, "phone" character varying, "institution" character varying, "field" character varying, "course" character varying, "yearOfStudy" character varying, "linkedIn" character varying, "website" character varying, "resumeUrl" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_115df6a6c4871e3b1a440b9574" UNIQUE ("user_id"), CONSTRAINT "PK_7cafa738d83d25d0ca42f10c65b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."startup_progress_status_enum" AS ENUM('pending', 'submitted', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "startup_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scoreAwarded" double precision NOT NULL, "comment" text, "status" "public"."startup_progress_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "startupStartupId" uuid, "subStageSubstageId" uuid, "reviewedById" uuid, CONSTRAINT "PK_e3578ab33be94d29197491b1e9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pitching_applications_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "pitching_applications" ("application_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "regNo" character varying, "first_name" character varying, "last_name" character varying, "surname" character varying, "email" character varying NOT NULL, "phone" character varying NOT NULL, "teamMembers" text array NOT NULL DEFAULT ARRAY[]::text[], "businessIdea" text NOT NULL, "problemStatement" text NOT NULL, "solution" text NOT NULL, "targetMarket" text NOT NULL, "revenueModel" text NOT NULL, "status" "public"."pitching_applications_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "startup_id" uuid, CONSTRAINT "REL_56fa5e2013e44ee9e381234cec" UNIQUE ("startup_id"), CONSTRAINT "PK_31eef1a6261ffedd83dd66abaf7" PRIMARY KEY ("application_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."startups_status_enum" AS ENUM('active', 'graduated', 'suspended')`);
        await queryRunner.query(`CREATE TABLE "startups" ("startup_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(150) NOT NULL, "description" text NOT NULL, "status" "public"."startups_status_enum" NOT NULL DEFAULT 'active', "cumulativeScore" double precision NOT NULL DEFAULT '0', "adminComment" text, "graduationDate" date, "teamMembers" text array NOT NULL DEFAULT ARRAY[]::text[], "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "application_id" uuid, "founder_id" uuid, "stage_id" uuid, "sub_stage_id" uuid, CONSTRAINT "REL_fc89b5a244bf2000e6fe82e1ef" UNIQUE ("application_id"), CONSTRAINT "PK_8e3f17b367f47066d1a764a59d8" PRIMARY KEY ("startup_id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "stage"`);
        await queryRunner.query(`DROP TYPE "public"."users_stage_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."events_targetaudience_enum" AS ENUM('everyone', 'registered', 'role', 'stage')`);
        await queryRunner.query(`ALTER TABLE "events" ADD "targetAudience" "public"."events_targetaudience_enum" NOT NULL DEFAULT 'everyone'`);
        await queryRunner.query(`ALTER TABLE "events" ADD "targetRoleId" integer`);
        await queryRunner.query(`ALTER TABLE "events" ADD "targetStageStageId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "currentProject" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "stage_id" uuid`);
        await queryRunner.query(`ALTER TABLE "substages" ADD CONSTRAINT "FK_34edc13eebcd4fa3317fad4898d" FOREIGN KEY ("stageStageId") REFERENCES "stages"("stage_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "substages" ADD CONSTRAINT "FK_89443a887e7d1c3affe9480383c" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stages" ADD CONSTRAINT "FK_424adf63c15dcf4795f3fc1fe0d" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_4fda77f7bb8586de93b8c1f51e3" FOREIGN KEY ("targetRoleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_cf49d50e60f92ed472f133f5663" FOREIGN KEY ("targetStageStageId") REFERENCES "stages"("stage_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentee_profiles" ADD CONSTRAINT "FK_115df6a6c4871e3b1a440b9574c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "startup_progress" ADD CONSTRAINT "FK_3b76bc2901d7e9cb48aea4cc237" FOREIGN KEY ("startupStartupId") REFERENCES "startups"("startup_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "startup_progress" ADD CONSTRAINT "FK_618e6f7c42d39f0e9fa3f11b6fd" FOREIGN KEY ("subStageSubstageId") REFERENCES "substages"("substage_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "startup_progress" ADD CONSTRAINT "FK_e7d7f9cbfb6739167e6044d1365" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pitching_applications" ADD CONSTRAINT "FK_bae2735b6e3f968d009dac6119a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pitching_applications" ADD CONSTRAINT "FK_56fa5e2013e44ee9e381234cec4" FOREIGN KEY ("startup_id") REFERENCES "startups"("startup_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "startups" ADD CONSTRAINT "FK_fc89b5a244bf2000e6fe82e1ef7" FOREIGN KEY ("application_id") REFERENCES "pitching_applications"("application_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "startups" ADD CONSTRAINT "FK_b9ec9988974174ed237a866ca31" FOREIGN KEY ("founder_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "startups" ADD CONSTRAINT "FK_498f6f356d9132627ea7f198088" FOREIGN KEY ("stage_id") REFERENCES "stages"("stage_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "startups" ADD CONSTRAINT "FK_7b53d3e45a0b977066feb07a36f" FOREIGN KEY ("sub_stage_id") REFERENCES "substages"("substage_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_beb2aa25c6a3c33ea2de4747ceb" FOREIGN KEY ("stage_id") REFERENCES "stages"("stage_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_beb2aa25c6a3c33ea2de4747ceb"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "startups" DROP CONSTRAINT "FK_7b53d3e45a0b977066feb07a36f"`);
        await queryRunner.query(`ALTER TABLE "startups" DROP CONSTRAINT "FK_498f6f356d9132627ea7f198088"`);
        await queryRunner.query(`ALTER TABLE "startups" DROP CONSTRAINT "FK_b9ec9988974174ed237a866ca31"`);
        await queryRunner.query(`ALTER TABLE "startups" DROP CONSTRAINT "FK_fc89b5a244bf2000e6fe82e1ef7"`);
        await queryRunner.query(`ALTER TABLE "pitching_applications" DROP CONSTRAINT "FK_56fa5e2013e44ee9e381234cec4"`);
        await queryRunner.query(`ALTER TABLE "pitching_applications" DROP CONSTRAINT "FK_bae2735b6e3f968d009dac6119a"`);
        await queryRunner.query(`ALTER TABLE "startup_progress" DROP CONSTRAINT "FK_e7d7f9cbfb6739167e6044d1365"`);
        await queryRunner.query(`ALTER TABLE "startup_progress" DROP CONSTRAINT "FK_618e6f7c42d39f0e9fa3f11b6fd"`);
        await queryRunner.query(`ALTER TABLE "startup_progress" DROP CONSTRAINT "FK_3b76bc2901d7e9cb48aea4cc237"`);
        await queryRunner.query(`ALTER TABLE "mentee_profiles" DROP CONSTRAINT "FK_115df6a6c4871e3b1a440b9574c"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_cf49d50e60f92ed472f133f5663"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_4fda77f7bb8586de93b8c1f51e3"`);
        await queryRunner.query(`ALTER TABLE "stages" DROP CONSTRAINT "FK_424adf63c15dcf4795f3fc1fe0d"`);
        await queryRunner.query(`ALTER TABLE "substages" DROP CONSTRAINT "FK_89443a887e7d1c3affe9480383c"`);
        await queryRunner.query(`ALTER TABLE "substages" DROP CONSTRAINT "FK_34edc13eebcd4fa3317fad4898d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "stage_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "currentProject"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "targetStageStageId"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "targetRoleId"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "targetAudience"`);
        await queryRunner.query(`DROP TYPE "public"."events_targetaudience_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."users_stage_enum" AS ENUM('pre-incubation', 'incubation', 'startup', 'alumni')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "stage" "public"."users_stage_enum" DEFAULT 'pre-incubation'`);
        await queryRunner.query(`DROP TABLE "startups"`);
        await queryRunner.query(`DROP TYPE "public"."startups_status_enum"`);
        await queryRunner.query(`DROP TABLE "pitching_applications"`);
        await queryRunner.query(`DROP TYPE "public"."pitching_applications_status_enum"`);
        await queryRunner.query(`DROP TABLE "startup_progress"`);
        await queryRunner.query(`DROP TYPE "public"."startup_progress_status_enum"`);
        await queryRunner.query(`DROP TABLE "mentee_profiles"`);
        await queryRunner.query(`DROP TABLE "stages"`);
        await queryRunner.query(`DROP TABLE "substages"`);
        await queryRunner.query(`DROP TYPE "public"."substages_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
