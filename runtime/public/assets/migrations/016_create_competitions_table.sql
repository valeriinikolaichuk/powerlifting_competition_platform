-- CreateEnum
CREATE TYPE "CompetitionLevel" AS ENUM ('INTERNATIONAL', 'NATIONAL', 'REGIONAL_OPEN', 'REGIONAL_ONLY', 'LOCAL_OPEN', 'LOCAL_ONLY');

-- CreateEnum
CREATE TYPE "CompetitionType" AS ENUM ('POWERLIFT', 'BENCH_PRESS');

-- CreateEnum
CREATE TYPE "CompetitionDivision" AS ENUM ('CLASSIC', 'EQUIPPED');

-- CreateEnum
CREATE TYPE "CompetitionStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "competitions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" UUID NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "competition_level" "CompetitionLevel" NOT NULL,
    "type" "CompetitionType" NOT NULL,
    "division" "CompetitionDivision" NOT NULL,
    "status" "CompetitionStatus" NOT NULL DEFAULT 'ACTIVE',
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "competitions_user_id_idx" ON "competitions"("user_id");

-- CreateIndex
CREATE INDEX "competitions_start_date_idx" ON "competitions"("start_date");

-- AddForeignKey
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
