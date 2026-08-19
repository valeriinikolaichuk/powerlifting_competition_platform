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
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_created_by_participant_id_fkey" FOREIGN KEY ("created_by_participant_id") REFERENCES "participants"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
