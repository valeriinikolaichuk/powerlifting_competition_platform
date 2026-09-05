/*
  Warnings:

  - The `code` column on the `federation_categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[federation_id,age_group_id,code]` on the table `federation_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TestingStatus" AS ENUM ('AM', 'PRO');

-- DropIndex
DROP INDEX "federation_categories_federation_id_age_group_id_key";

-- AlterTable
ALTER TABLE "age_groups" ADD COLUMN     "age_group_code" TEXT;

-- AlterTable
ALTER TABLE "federation_categories" DROP COLUMN "code",
ADD COLUMN     "code" "TestingStatus";

-- CreateTable
CREATE TABLE "federation_age_subgroups" (
    "id" UUID NOT NULL,
    "federation_category_id" UUID NOT NULL,
    "age_group_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "federation_age_subgroups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "federation_age_subgroups_federation_category_id_age_group_i_key" ON "federation_age_subgroups"("federation_category_id", "age_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "federation_categories_federation_id_age_group_id_code_key" ON "federation_categories"("federation_id", "age_group_id", "code");

-- AddForeignKey
ALTER TABLE "federation_age_subgroups" ADD CONSTRAINT "federation_age_subgroups_federation_category_id_fkey" FOREIGN KEY ("federation_category_id") REFERENCES "federation_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "federation_age_subgroups" ADD CONSTRAINT "federation_age_subgroups_age_group_id_fkey" FOREIGN KEY ("age_group_id") REFERENCES "age_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
