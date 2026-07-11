-- CreateEnum
CREATE TYPE "DefaultCoefficient" AS ENUM ('WILKS', 'IPF_GL');

-- CreateTable
CREATE TABLE "federations" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "federation_code" TEXT NOT NULL,
    "default_coefficient" "DefaultCoefficient" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "federations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "federations_federation_code_key" ON "federations"("federation_code");
