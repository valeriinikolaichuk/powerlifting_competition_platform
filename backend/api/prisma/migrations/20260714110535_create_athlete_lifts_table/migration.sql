-- CreateEnum
CREATE TYPE "LiftType" AS ENUM ('SQUAT', 'BENCH_PRESS', 'DEADLIFT');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('REQUESTED', 'GOOD_LIFT', 'NO_LIFT', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "athlete_lifts" (
    "id" UUID NOT NULL,
    "athlete_registration_id" UUID NOT NULL,
    "lift_type" "LiftType" NOT NULL,
    "attempt_1_requested" DECIMAL(4,1),
    "attempt_1_result" DECIMAL(4,1),
    "attempt_1_status" "AttemptStatus" NOT NULL DEFAULT 'REQUESTED',
    "attempt_2_requested" DECIMAL(4,1),
    "attempt_2_result" DECIMAL(4,1),
    "attempt_2_status" "AttemptStatus" NOT NULL DEFAULT 'REQUESTED',
    "attempt_3_requested" DECIMAL(4,1),
    "attempt_3_result" DECIMAL(4,1),
    "attempt_3_status" "AttemptStatus" NOT NULL DEFAULT 'REQUESTED',
    "attempt_4_requested" DECIMAL(4,1),
    "attempt_4_result" DECIMAL(4,1),
    "attempt_4_status" "AttemptStatus" NOT NULL DEFAULT 'REQUESTED',
    "best_attempt" DECIMAL(4,1),
    "best_attempt_predicted" DECIMAL(4,1),
    "lift_coefficient" DECIMAL(5,2),
    "lift_coefficient_predicted" DECIMAL(5,2),
    "lift_place" INTEGER,
    "lift_place_predicted" INTEGER,
    "lift_points" INTEGER,
    "lift_points_predicted" INTEGER,
    "best_discipline_place" INTEGER,
    "best_discipline_place_predicted" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "athlete_lifts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "athlete_lifts_athlete_registration_id_idx" ON "athlete_lifts"("athlete_registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "athlete_lifts_athlete_registration_id_lift_type_key" ON "athlete_lifts"("athlete_registration_id", "lift_type");

-- AddForeignKey
ALTER TABLE "athlete_lifts" ADD CONSTRAINT "athlete_lifts_athlete_registration_id_fkey" FOREIGN KEY ("athlete_registration_id") REFERENCES "athlete_registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
