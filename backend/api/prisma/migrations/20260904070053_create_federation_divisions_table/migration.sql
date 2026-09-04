-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CoefficientDivision" ADD VALUE 'RAW';
ALTER TYPE "CoefficientDivision" ADD VALUE 'MULTI_PLY';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CompetitionDivision" ADD VALUE 'RAW';
ALTER TYPE "CompetitionDivision" ADD VALUE 'MULTI_PLY';

-- CreateTable
CREATE TABLE "federation_divisions" (
    "id" UUID NOT NULL,
    "federation_id" UUID NOT NULL,
    "division" "CompetitionDivision" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "federation_divisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "federation_divisions_federation_id_division_key" ON "federation_divisions"("federation_id", "division");

-- AddForeignKey
ALTER TABLE "federation_divisions" ADD CONSTRAINT "federation_divisions_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
