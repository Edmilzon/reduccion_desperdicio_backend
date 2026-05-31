import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordHistory1780077734994 implements MigrationInterface {
    name = 'AddPasswordHistory1780077734994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_history" ("id" SERIAL NOT NULL, "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_password_history" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_password_expires" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_password_attempts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "token_version" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "password_history" ADD CONSTRAINT "FK_password_history_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_history" DROP CONSTRAINT "FK_password_history_user"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token_version"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_password_attempts"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_password_expires"`);
        await queryRunner.query(`DROP TABLE "password_history"`);
    }

}
