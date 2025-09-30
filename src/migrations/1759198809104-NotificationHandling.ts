import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationHandling1759198809104 implements MigrationInterface {
    name = 'NotificationHandling1759198809104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_0555e13c32a4b9023d342328253" UNIQUE ("name"), CONSTRAINT "PK_7705fddb5be87ede3a1da250ac7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification_group_members" ("notificationGroupsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_f7c912a2487f50b24a7b1db31d7" PRIMARY KEY ("notificationGroupsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a72efa6ff01fc483caccca0806" ON "notification_group_members" ("notificationGroupsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ca0d9dc54a1d73e57dd9545dfc" ON "notification_group_members" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "senderId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('alert', 'warning', 'update')`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'update'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_ddb7981cf939fe620179bfea33a" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_group_members" ADD CONSTRAINT "FK_a72efa6ff01fc483caccca0806d" FOREIGN KEY ("notificationGroupsId") REFERENCES "notification_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notification_group_members" ADD CONSTRAINT "FK_ca0d9dc54a1d73e57dd9545dfc4" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_group_members" DROP CONSTRAINT "FK_ca0d9dc54a1d73e57dd9545dfc4"`);
        await queryRunner.query(`ALTER TABLE "notification_group_members" DROP CONSTRAINT "FK_a72efa6ff01fc483caccca0806d"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_ddb7981cf939fe620179bfea33a"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "type" character varying NOT NULL DEFAULT 'info'`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "senderId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca0d9dc54a1d73e57dd9545dfc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a72efa6ff01fc483caccca0806"`);
        await queryRunner.query(`DROP TABLE "notification_group_members"`);
        await queryRunner.query(`DROP TABLE "notification_groups"`);
    }

}
