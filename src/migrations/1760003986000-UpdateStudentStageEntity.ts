import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentStageEntity1760003986000 implements MigrationInterface {
  name = 'UpdateStudentStageEntity1760003986000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint if it exists
    await queryRunner.query(`ALTER TABLE "student_stages" DROP CONSTRAINT IF EXISTS "FK_student_stages_stage"`);

    // Drop the stage column if it exists as a foreign key reference
    await queryRunner.query(`ALTER TABLE "student_stages" DROP COLUMN IF EXISTS "stageId"`);

    // Add or modify the stage column to be an enum
    await queryRunner.query(`ALTER TABLE "student_stages" ADD COLUMN IF NOT EXISTS "stage" character varying`);

    // Create the enum type if it doesn't exist
    await queryRunner.query(`DO $$ BEGIN
            CREATE TYPE "stage_enum" AS ENUM ('pre-incubation', 'incubation', 'startup', 'alumni');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;`);

    // Alter the column to use the enum type
    await queryRunner.query(`ALTER TABLE "student_stages" ALTER COLUMN "stage" TYPE "stage_enum" USING "stage"::"stage_enum"`);

    // Make the column NOT NULL if needed
    await queryRunner.query(`ALTER TABLE "student_stages" ALTER COLUMN "stage" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert back to the original structure if needed
    await queryRunner.query(`ALTER TABLE "student_stages" DROP COLUMN "stage"`);

    // Drop the enum type
    await queryRunner.query(`DROP TYPE IF EXISTS "stage_enum"`);

    // Note: You may need to recreate the original foreign key structure here
    // depending on your original schema
  }
}