/*
  Warnings:

  - You are about to drop the column `default_coefficient` on the `federations` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CoefficientDivision" AS ENUM ('CLASSIC', 'EQUIPPED', 'ANY');

-- CreateEnum
CREATE TYPE "CoefficientDiscipline" AS ENUM ('POWERLIFT', 'BENCH_PRESS', 'ANY');

-- AlterTable
ALTER TABLE "federations" DROP COLUMN "default_coefficient";

-- DropEnum
DROP TYPE "DefaultCoefficient";

-- CreateTable
CREATE TABLE "coefficients" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "division" "CoefficientDivision" NOT NULL,
    "discipline" "CoefficientDiscipline" NOT NULL,

    CONSTRAINT "coefficients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "federation_coefficients" (
    "id" UUID NOT NULL,
    "federation_id" UUID NOT NULL,
    "coefficient_id" UUID NOT NULL,

    CONSTRAINT "federation_coefficients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coefficients_code_key" ON "coefficients"("code");

-- CreateIndex
CREATE UNIQUE INDEX "federation_coefficients_federation_id_coefficient_id_key" ON "federation_coefficients"("federation_id", "coefficient_id");

-- AddForeignKey
ALTER TABLE "federation_coefficients" ADD CONSTRAINT "federation_coefficients_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "federation_coefficients" ADD CONSTRAINT "federation_coefficients_coefficient_id_fkey" FOREIGN KEY ("coefficient_id") REFERENCES "coefficients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
