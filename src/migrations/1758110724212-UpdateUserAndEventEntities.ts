import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserAndEventEntities1758110724212 implements MigrationInterface {
    name = 'UpdateUserAndEventEntities1758110724212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "location" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "events" ADD "objective" text`);
        await queryRunner.query(`ALTER TABLE "events" ADD "date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" ADD "timeFrom" TIME`);
        await queryRunner.query(`ALTER TABLE "events" ADD "timeTo" TIME`);
        await queryRunner.query(`ALTER TABLE "events" ADD "details" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "regNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "regNumber"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "details"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "timeTo"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "timeFrom"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "objective"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "end_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" ADD "start_date" TIMESTAMP NOT NULL`);
    }

}
