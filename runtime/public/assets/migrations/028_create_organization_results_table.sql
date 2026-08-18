-- CreateTable
CREATE TABLE "organization_results" (
    "id" UUID NOT NULL,
    "competition_organization_id" UUID NOT NULL,
    "competition_age_group_id" UUID NOT NULL,
    "total_points" INTEGER NOT NULL,
    "weight_points" DECIMAL(6,1) NOT NULL,
    "place" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "organization_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "organization_results_competition_age_group_id_idx" ON "organization_results"("competition_age_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_results_competition_organization_id_competitio_key" ON "organization_results"("competition_organization_id", "competition_age_group_id");

-- AddForeignKey
ALTER TABLE "organization_results" ADD CONSTRAINT "organization_results_competition_organization_id_fkey" FOREIGN KEY ("competition_organization_id") REFERENCES "competition_organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_results" ADD CONSTRAINT "organization_results_competition_age_group_id_fkey" FOREIGN KEY ("competition_age_group_id") REFERENCES "competition_age_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
