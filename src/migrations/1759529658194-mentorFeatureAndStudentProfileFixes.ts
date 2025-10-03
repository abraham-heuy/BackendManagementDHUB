import { MigrationInterface, QueryRunner } from "typeorm";

export class MentorFeatureAndStudentProfileFixes1759529658194 implements MigrationInterface {
    name = 'MentorFeatureAndStudentProfileFixes1759529658194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor_allocations" DROP CONSTRAINT "UQ_fb841b90f282d2112cf6414fa9c"`);
        await queryRunner.query(`ALTER TABLE "mentor_allocations" RENAME COLUMN "allocated_at" TO "created_at"`);
        await queryRunner.query(`CREATE TABLE "mentor_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "specialization" text, "experience" text, "recentProject" text, "contact" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_5fa86c14c3a0de91f7253a180b" UNIQUE ("user_id"), CONSTRAINT "PK_e903fcb76451c2b21ce24565683" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "student_profiles" ADD "field" character varying`);
        await queryRunner.query(`ALTER TABLE "mentor_profiles" ADD CONSTRAINT "FK_5fa86c14c3a0de91f7253a180bb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor_profiles" DROP CONSTRAINT "FK_5fa86c14c3a0de91f7253a180bb"`);
        await queryRunner.query(`ALTER TABLE "student_profiles" DROP COLUMN "field"`);
        await queryRunner.query(`DROP TABLE "mentor_profiles"`);
        await queryRunner.query(`ALTER TABLE "mentor_allocations" RENAME COLUMN "created_at" TO "allocated_at"`);
        await queryRunner.query(`ALTER TABLE "mentor_allocations" ADD CONSTRAINT "UQ_fb841b90f282d2112cf6414fa9c" UNIQUE ("studentId", "mentorId")`);
    }

}
