-- CreateEnum
CREATE TYPE "CompetitionOrganizationType" AS ENUM ('COUNTRY', 'REGION', 'CITY', 'SPORT_SCHOOL', 'CLUB', 'UNIVERSITY', 'SPORT_SOCIETY');

-- CreateTable
CREATE TABLE "competition_organizations" (
    "id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "country_id" UUID,
    "region_id" UUID,
    "city_id" UUID,
    "organization_id" UUID NOT NULL,
    "type" "CompetitionOrganizationType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "competition_organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "competition_organizations_competition_id_idx" ON "competition_organizations"("competition_id");

-- CreateIndex
CREATE UNIQUE INDEX "competition_organizations_competition_id_country_id_region__key" ON "competition_organizations"("competition_id", "country_id", "region_id", "city_id", "organization_id", "type");

-- AddForeignKey
ALTER TABLE "competition_organizations" ADD CONSTRAINT "competition_organizations_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_organizations" ADD CONSTRAINT "competition_organizations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_organizations" ADD CONSTRAINT "competition_organizations_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_organizations" ADD CONSTRAINT "competition_organizations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_organizations" ADD CONSTRAINT "competition_organizations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
