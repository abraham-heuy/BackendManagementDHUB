import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventApplicationsAndEventEntities1758116563659 implements MigrationInterface {
    name = 'UpdateEventApplicationsAndEventEntities1758116563659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_applications" DROP CONSTRAINT "FK_931f579420077e8fb42628b5200"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP CONSTRAINT "UQ_7d6e4a27bd144a7c34a0f1288b0"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "applied_at"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "studentId"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "regNo" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "teamMembers" text`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "businessIdea" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "problemStatement" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "solution" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "targetMarket" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "revenueModel" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "isPassed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "appliedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE TYPE "public"."events_category_enum" AS ENUM('hackathon', 'workshop', 'seminar', 'training', 'other')`);
        await queryRunner.query(`ALTER TABLE "events" ADD "category" "public"."events_category_enum" NOT NULL DEFAULT 'other'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."events_category_enum"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "appliedAt"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "isPassed"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "revenueModel"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "targetMarket"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "solution"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "problemStatement"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "businessIdea"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "teamMembers"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "event_applications" DROP COLUMN "regNo"`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "studentId" uuid`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD "applied_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD CONSTRAINT "UQ_7d6e4a27bd144a7c34a0f1288b0" UNIQUE ("eventId", "studentId")`);
        await queryRunner.query(`ALTER TABLE "event_applications" ADD CONSTRAINT "FK_931f579420077e8fb42628b5200" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
