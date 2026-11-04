/*
  Warnings:

  - You are about to drop the column `competition_id` on the `athlete_registrations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[athlete_id,competition_age_group_id]` on the table `athlete_registrations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "athlete_registrations" DROP CONSTRAINT "athlete_registrations_competition_id_fkey";

-- DropIndex
DROP INDEX "athlete_registrations_competition_id_athlete_id_competition_key";

-- DropIndex
DROP INDEX "athlete_registrations_competition_id_group_in_session_id_idx";

-- DropIndex
DROP INDEX "athlete_registrations_competition_id_idx";

-- DropIndex
DROP INDEX "athlete_registrations_competition_id_weight_class_id_idx";

-- AlterTable
ALTER TABLE "athlete_registrations" DROP COLUMN "competition_id";

-- CreateIndex
CREATE UNIQUE INDEX "athlete_registrations_athlete_id_competition_age_group_id_key" ON "athlete_registrations"("athlete_id", "competition_age_group_id");
