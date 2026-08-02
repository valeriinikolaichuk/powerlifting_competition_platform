/*
  Warnings:

  - Added the required column `language` to the `athletes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `countries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `regions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `sport_officials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "athletes" ADD COLUMN     "language" "Language" NOT NULL;

-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "language" "Language" NOT NULL;

-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "language" "Language" NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "language" "Language" NOT NULL;

-- AlterTable
ALTER TABLE "regions" ADD COLUMN     "language" "Language" NOT NULL;

-- AlterTable
ALTER TABLE "sport_officials" ADD COLUMN     "language" "Language" NOT NULL;
