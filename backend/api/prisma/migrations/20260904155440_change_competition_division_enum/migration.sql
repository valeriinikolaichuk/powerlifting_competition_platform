/*
  Warnings:

  - The values [CLASSIC,EQUIPPED] on the enum `CoefficientDivision` will be removed. If these variants are still used in the database, this will fail.
  - The values [CLASSIC,EQUIPPED] on the enum `CompetitionDivision` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CoefficientDivision_new" AS ENUM ('RAW', 'RAW_WRAPS', 'SINGLE_PLY', 'MULTI_PLY', 'ANY');
ALTER TABLE "coefficients" ALTER COLUMN "division" TYPE "CoefficientDivision_new" USING ("division"::text::"CoefficientDivision_new");
ALTER TYPE "CoefficientDivision" RENAME TO "CoefficientDivision_old";
ALTER TYPE "CoefficientDivision_new" RENAME TO "CoefficientDivision";
DROP TYPE "CoefficientDivision_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CompetitionDivision_new" AS ENUM ('RAW', 'RAW_WRAPS', 'SINGLE_PLY', 'MULTI_PLY');
ALTER TABLE "federation_divisions" ALTER COLUMN "division" TYPE "CompetitionDivision_new" USING ("division"::text::"CompetitionDivision_new");
ALTER TABLE "competitions" ALTER COLUMN "division" TYPE "CompetitionDivision_new" USING ("division"::text::"CompetitionDivision_new");
ALTER TYPE "CompetitionDivision" RENAME TO "CompetitionDivision_old";
ALTER TYPE "CompetitionDivision_new" RENAME TO "CompetitionDivision";
DROP TYPE "CompetitionDivision_old";
COMMIT;
