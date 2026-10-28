/*
  Warnings:

  - You are about to drop the column `sport_titles` on the `athlete_registrations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "athlete_registrations" DROP COLUMN "sport_titles";

-- AlterTable
ALTER TABLE "athletes" ADD COLUMN     "sport_titles" TEXT;
