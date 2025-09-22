import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessLogsAndUserEntities1758131617690 implements MigrationInterface {
    name = 'ProcessLogsAndUserEntities1758131617690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_stage_enum" AS ENUM('pre-incubation', 'incubation', 'startup', 'alumni')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "stage" "public"."users_stage_enum"`);
        await queryRunner.query(`ALTER TABLE "progress_logs" DROP COLUMN "old_stage"`);
        await queryRunner.query(`CREATE TYPE "public"."progress_logs_old_stage_enum" AS ENUM('pre-incubation', 'incubation', 'startup', 'alumni')`);
        await queryRunner.query(`ALTER TABLE "progress_logs" ADD "old_stage" "public"."progress_logs_old_stage_enum"`);
        await queryRunner.query(`ALTER TABLE "progress_logs" DROP COLUMN "new_stage"`);
        await queryRunner.query(`CREATE TYPE "public"."progress_logs_new_stage_enum" AS ENUM('pre-incubation', 'incubation', 'startup', 'alumni')`);
        await queryRunner.query(`ALTER TABLE "progress_logs" ADD "new_stage" "public"."progress_logs_new_stage_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "progress_logs" DROP COLUMN "new_stage"`);
        await queryRunner.query(`DROP TYPE "public"."progress_logs_new_stage_enum"`);
        await queryRunner.query(`ALTER TABLE "progress_logs" ADD "new_stage" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "progress_logs" DROP COLUMN "old_stage"`);
        await queryRunner.query(`DROP TYPE "public"."progress_logs_old_stage_enum"`);
        await queryRunner.query(`ALTER TABLE "progress_logs" ADD "old_stage" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "stage"`);
        await queryRunner.query(`DROP TYPE "public"."users_stage_enum"`);
    }

}
