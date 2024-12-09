import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1733750453899 implements MigrationInterface {
    name = 'CreateProductsTable1733750453899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "price" decimal(10,2) NOT NULL, "images" text NOT NULL, "color" varchar NOT NULL, "material" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
