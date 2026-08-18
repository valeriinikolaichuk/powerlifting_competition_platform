-- CreateEnum
CREATE TYPE "TeamScoringMethod" AS ENUM ('BEST_POINTS', 'ALL_POINTS');

-- CreateTable
CREATE TABLE "competition_age_groups" (
    "id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "federation_category_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "team_scoring_limit" INTEGER,
    "team_scoring_method" "TeamScoringMethod" NOT NULL DEFAULT 'BEST_POINTS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "competition_age_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "competition_age_groups_competition_id_federation_category_i_key" ON "competition_age_groups"("competition_id", "federation_category_id");

-- AddForeignKey
ALTER TABLE "competition_age_groups" ADD CONSTRAINT "competition_age_groups_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_age_groups" ADD CONSTRAINT "competition_age_groups_federation_category_id_fkey" FOREIGN KEY ("federation_category_id") REFERENCES "federation_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
