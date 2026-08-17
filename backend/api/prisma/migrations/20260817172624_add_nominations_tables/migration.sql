/*
  Warnings:

  - The values [WITHDRAWN] on the enum `AttemptStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `verification_status` on the `athlete_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `verification_status` on the `referee_competition` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AthleteQualification" AS ENUM ('QUALIFIED', 'WITHDRAWN', 'DISQUALIFIED');

-- AlterEnum
BEGIN;
CREATE TYPE "AttemptStatus_new" AS ENUM ('REQUESTED', 'GOOD_LIFT', 'NO_LIFT');
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_1_status" DROP DEFAULT;
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_2_status" DROP DEFAULT;
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_3_status" DROP DEFAULT;
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_4_status" DROP DEFAULT;
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_1_status" TYPE "AttemptStatus_new" USING ("attempt_1_status"::text::"AttemptStatus_new");
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_2_status" TYPE "AttemptStatus_new" USING ("attempt_2_status"::text::"AttemptStatus_new");
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_3_status" TYPE "AttemptStatus_new" USING ("attempt_3_status"::text::"AttemptStatus_new");
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_4_status" TYPE "AttemptStatus_new" USING ("attempt_4_status"::text::"AttemptStatus_new");
ALTER TYPE "AttemptStatus" RENAME TO "AttemptStatus_old";
ALTER TYPE "AttemptStatus_new" RENAME TO "AttemptStatus";
DROP TYPE "AttemptStatus_old";
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_1_status" SET DEFAULT 'REQUESTED';
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_2_status" SET DEFAULT 'REQUESTED';
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_3_status" SET DEFAULT 'REQUESTED';
ALTER TABLE "athlete_lifts" ALTER COLUMN "attempt_4_status" SET DEFAULT 'REQUESTED';
COMMIT;

-- DropIndex
DROP INDEX "athlete_registrations_verification_status_idx";

-- AlterTable
ALTER TABLE "athlete_registrations" DROP COLUMN "verification_status",
ADD COLUMN     "qualification" "AthleteQualification" NOT NULL DEFAULT 'QUALIFIED',
ALTER COLUMN "status" SET DEFAULT 'TEAM';

-- AlterTable
ALTER TABLE "referee_competition" DROP COLUMN "verification_status";

-- CreateTable
CREATE TABLE "referee_nominations" (
    "id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "referee_id" UUID,
    "full_name" TEXT,
    "referee_category_id" UUID NOT NULL,
    "country_id" UUID,
    "country_name" TEXT,
    "region_id" UUID,
    "region_name" TEXT,
    "city_id" UUID,
    "city_name" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "created_by_participant_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "referee_nominations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athlete_nominations" (
    "id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "athlete_id" UUID,
    "full_name" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "country_id" UUID,
    "country_name" TEXT,
    "region_id" UUID,
    "region_name" TEXT,
    "city_id" UUID,
    "city_name" TEXT,
    "sport_society_id" UUID,
    "sport_society_code" TEXT,
    "club_id" UUID,
    "club_code" TEXT,
    "sport_school_id" UUID,
    "sport_school_code" TEXT,
    "university_id" UUID,
    "university_code" TEXT,
    "competition_age_group_id" UUID NOT NULL,
    "trainer_1_id" UUID,
    "trainer_1_full_name" TEXT,
    "trainer_2_id" UUID,
    "trainer_2_full_name" TEXT,
    "trainer_3_id" UUID,
    "trainer_3_full_name" TEXT,
    "trainer_4_id" UUID,
    "trainer_4_full_name" TEXT,
    "sport_rank_class" TEXT,
    "squat_nominated" DECIMAL(4,1),
    "bench_press_nominated" DECIMAL(4,1),
    "deadlift_nominated" DECIMAL(4,1),
    "total_nominated" DECIMAL(5,1),
    "weight_class_id" UUID,
    "status" "AthleteRegistrationStatus" NOT NULL,
    "created_by_participant_id" UUID NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "athlete_nominations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referee_nominations_competition_id_idx" ON "referee_nominations"("competition_id");

-- CreateIndex
CREATE INDEX "referee_nominations_referee_id_idx" ON "referee_nominations"("referee_id");

-- CreateIndex
CREATE INDEX "referee_nominations_created_by_participant_id_idx" ON "referee_nominations"("created_by_participant_id");

-- CreateIndex
CREATE INDEX "referee_nominations_verification_status_idx" ON "referee_nominations"("verification_status");

-- CreateIndex
CREATE INDEX "athlete_nominations_competition_id_idx" ON "athlete_nominations"("competition_id");

-- CreateIndex
CREATE INDEX "athlete_nominations_weight_class_id_idx" ON "athlete_nominations"("weight_class_id");

-- CreateIndex
CREATE INDEX "athlete_nominations_status_idx" ON "athlete_nominations"("status");

-- CreateIndex
CREATE INDEX "athlete_nominations_verification_status_idx" ON "athlete_nominations"("verification_status");

-- CreateIndex
CREATE INDEX "athlete_nominations_competition_age_group_id_idx" ON "athlete_nominations"("competition_age_group_id");

-- CreateIndex
CREATE INDEX "athlete_nominations_created_by_participant_id_idx" ON "athlete_nominations"("created_by_participant_id");

-- CreateIndex
CREATE INDEX "athlete_nominations_competition_id_weight_class_id_idx" ON "athlete_nominations"("competition_id", "weight_class_id");

-- AddForeignKey
ALTER TABLE "referee_nominations" ADD CONSTRAINT "referee_nominations_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_nominations" ADD CONSTRAINT "referee_nominations_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "sport_officials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_nominations" ADD CONSTRAINT "referee_nominations_referee_category_id_fkey" FOREIGN KEY ("referee_category_id") REFERENCES "referee_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_nominations" ADD CONSTRAINT "referee_nominations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_nominations" ADD CONSTRAINT "referee_nominations_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_nominations" ADD CONSTRAINT "referee_nominations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_nominations" ADD CONSTRAINT "referee_nominations_created_by_participant_id_fkey" FOREIGN KEY ("created_by_participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_sport_society_id_fkey" FOREIGN KEY ("sport_society_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_sport_school_id_fkey" FOREIGN KEY ("sport_school_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_competition_age_group_id_fkey" FOREIGN KEY ("competition_age_group_id") REFERENCES "competition_age_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_trainer_1_id_fkey" FOREIGN KEY ("trainer_1_id") REFERENCES "sport_officials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_trainer_2_id_fkey" FOREIGN KEY ("trainer_2_id") REFERENCES "sport_officials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_trainer_3_id_fkey" FOREIGN KEY ("trainer_3_id") REFERENCES "sport_officials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_trainer_4_id_fkey" FOREIGN KEY ("trainer_4_id") REFERENCES "sport_officials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_weight_class_id_fkey" FOREIGN KEY ("weight_class_id") REFERENCES "weight_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_created_by_participant_id_fkey" FOREIGN KEY ("created_by_participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
