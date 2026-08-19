-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

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

-- CreateIndex
CREATE INDEX "referee_nominations_competition_id_idx" ON "referee_nominations"("competition_id");

-- CreateIndex
CREATE INDEX "referee_nominations_referee_id_idx" ON "referee_nominations"("referee_id");

-- CreateIndex
CREATE INDEX "referee_nominations_created_by_participant_id_idx" ON "referee_nominations"("created_by_participant_id");

-- CreateIndex
CREATE INDEX "referee_nominations_verification_status_idx" ON "referee_nominations"("verification_status");

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
ALTER TABLE "referee_nominations" ADD CONSTRAINT "referee_nominations_created_by_participant_id_fkey" FOREIGN KEY ("created_by_participant_id") REFERENCES "participants"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
