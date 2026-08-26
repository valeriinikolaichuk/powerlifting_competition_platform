-- CreateEnum
CREATE TYPE "CoefficientDivision" AS ENUM ('CLASSIC', 'EQUIPPED', 'ANY');

-- CreateEnum
CREATE TYPE "CoefficientDiscipline" AS ENUM ('POWERLIFT', 'BENCH_PRESS', 'ANY');

-- CreateTable
CREATE TABLE "coefficients" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "division" "CoefficientDivision" NOT NULL,
    "discipline" "CoefficientDiscipline" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coefficients_pkey" PRIMARY KEY ("id")
);
