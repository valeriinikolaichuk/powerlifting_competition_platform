/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `athletes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "date_of_birth",
ADD COLUMN     "birth_day" SMALLINT,
ADD COLUMN     "birth_month" SMALLINT,
ADD COLUMN     "birth_year" SMALLINT;
