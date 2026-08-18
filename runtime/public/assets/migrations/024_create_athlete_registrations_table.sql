-- CreateEnum
CREATE TYPE "AthleteRegistrationStatus" AS ENUM ('TEAM', 'PERSONALLY', 'OUT_OF_COMP');

-- CreateTable
CREATE TABLE "athlete_registrations" (
    "id" UUID NOT NULL,
    "athlete_id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "country_id" UUID,
    "region_id" UUID,
    "city_id" UUID,
    "sport_society_id" UUID,
    "club_id" UUID,
    "sport_school_id" UUID,
    "university_id" UUID,
    "competition_age_group_id" UUID NOT NULL,
    "trainer_1_id" UUID,
    "trainer_2_id" UUID,
    "trainer_3_id" UUID,
    "trainer_4_id" UUID,
    "sport_rank_class" TEXT,
    "sport_titles" TEXT,
    "squat_nominated" DECIMAL(4,1),
    "bench_press_nominated" DECIMAL(4,1),
    "deadlift_nominated" DECIMAL(4,1),
    "total_nominated" DECIMAL(5,1),
    "weight_class_id" UUID,
    "bodyweight" DECIMAL(5,2),
    "athlete_coefficient" DECIMAL(5,4),
    "group_in_session_id" UUID,
    "lot" INTEGER,
    "double" BOOLEAN NOT NULL DEFAULT false,
    "status" "AthleteRegistrationStatus" NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "athlete_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "athlete_registrations_competition_id_idx" ON "athlete_registrations"("competition_id");

-- CreateIndex
CREATE INDEX "athlete_registrations_weight_class_id_idx" ON "athlete_registrations"("weight_class_id");

-- CreateIndex
CREATE INDEX "athlete_registrations_group_in_session_id_idx" ON "athlete_registrations"("group_in_session_id");

-- CreateIndex
CREATE INDEX "athlete_registrations_status_idx" ON "athlete_registrations"("status");

-- CreateIndex
CREATE INDEX "athlete_registrations_verification_status_idx" ON "athlete_registrations"("verification_status");

-- CreateIndex
CREATE INDEX "athlete_registrations_competition_age_group_id_idx" ON "athlete_registrations"("competition_age_group_id");

-- CreateIndex
CREATE INDEX "athlete_registrations_competition_id_weight_class_id_idx" ON "athlete_registrations"("competition_id", "weight_class_id");

-- CreateIndex
CREATE INDEX "athlete_registrations_competition_id_group_in_session_id_idx" ON "athlete_registrations"("competition_id", "group_in_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "athlete_registrations_competition_id_athlete_id_competition_key" ON "athlete_registrations"("competition_id", "athlete_id", "competition_age_group_id");

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_sport_society_id_fkey" FOREIGN KEY ("sport_society_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_sport_school_id_fkey" FOREIGN KEY ("sport_school_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_competition_age_group_id_fkey" FOREIGN KEY ("competition_age_group_id") REFERENCES "competition_age_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_trainer_1_id_fkey" FOREIGN KEY ("trainer_1_id") REFERENCES "sport_officials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_trainer_2_id_fkey" FOREIGN KEY ("trainer_2_id") REFERENCES "sport_officials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_trainer_3_id_fkey" FOREIGN KEY ("trainer_3_id") REFERENCES "sport_officials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_trainer_4_id_fkey" FOREIGN KEY ("trainer_4_id") REFERENCES "sport_officials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_weight_class_id_fkey" FOREIGN KEY ("weight_class_id") REFERENCES "weight_classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_registrations" ADD CONSTRAINT "athlete_registrations_group_in_session_id_fkey" FOREIGN KEY ("group_in_session_id") REFERENCES "groups_in_session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
