-- CreateTable
CREATE TABLE "competition_results" (
    "id" UUID NOT NULL,
    "athlete_registration_id" UUID NOT NULL,
    "total" DECIMAL(5,1),
    "total_predicted" DECIMAL(5,1),
    "total_coefficient" DECIMAL(5,2),
    "total_coefficient_predicted" DECIMAL(5,2),
    "overall_place" INTEGER,
    "overall_place_predicted" INTEGER,
    "overall_points" INTEGER,
    "overall_points_predicted" INTEGER,
    "best_lifter_place" INTEGER,
    "best_lifter_place_predicted" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "competition_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "competition_results_athlete_registration_id_key" ON "competition_results"("athlete_registration_id");

-- AddForeignKey
ALTER TABLE "competition_results" ADD CONSTRAINT "competition_results_athlete_registration_id_fkey" FOREIGN KEY ("athlete_registration_id") REFERENCES "athlete_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
