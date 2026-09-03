-- AlterTable
ALTER TABLE "age_groups" ALTER COLUMN "age_from" DROP NOT NULL,
ALTER COLUMN "age_to" DROP NOT NULL;

-- AlterTable
ALTER TABLE "federation_categories" ALTER COLUMN "default_team_scoring_limit" DROP NOT NULL;
