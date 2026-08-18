-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "referee_competition" (
    "id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "referee_id" UUID NOT NULL,
    "referee_category_id" UUID NOT NULL,
    "country_id" UUID,
    "region_id" UUID,
    "city_id" UUID,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "referee_competition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referee_competition_competition_id_idx" ON "referee_competition"("competition_id");

-- CreateIndex
CREATE INDEX "referee_competition_referee_id_idx" ON "referee_competition"("referee_id");

-- CreateIndex
CREATE UNIQUE INDEX "referee_competition_competition_id_referee_id_key" ON "referee_competition"("competition_id", "referee_id");

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "sport_officials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_referee_category_id_fkey" FOREIGN KEY ("referee_category_id") REFERENCES "referee_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
