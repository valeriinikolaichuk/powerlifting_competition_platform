------------------ federations -----------------

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

------------------ age_groups -----------------

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MEN', 'WOMEN');

-- CreateTable
CREATE TABLE "age_groups" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "age_from" INTEGER NOT NULL,
    "age_to" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "age_groups_pkey" PRIMARY KEY ("id")
);

------------------ users -----------------

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

------------------ weight_classes -----------------

-- CreateTable
CREATE TABLE "weight_classes" (
    "id" UUID NOT NULL,
    "weight_class" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "weight_class_group" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weight_classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "weight_classes_weight_class_group_weight_class_key" ON "weight_classes"("weight_class_group", "weight_class");

------------------ federation_categories -----------------

-- CreateTable
CREATE TABLE "federation_categories" (
    "id" UUID NOT NULL,
    "federation_id" UUID NOT NULL,
    "age_group_id" UUID NOT NULL,
    "weight_class_group" INTEGER NOT NULL,
    "default_team_scoring_limit" INTEGER NOT NULL, --add migration
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "federation_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "federation_categories_federation_id_age_group_id_key" ON "federation_categories"("federation_id", "age_group_id");

-- AddForeignKey
ALTER TABLE "federation_categories" ADD CONSTRAINT "federation_categories_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "federation_categories" ADD CONSTRAINT "federation_categories_age_group_id_fkey" FOREIGN KEY ("age_group_id") REFERENCES "age_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

------------------ countries -----------------

-- CreateEnum
CREATE TYPE "DataScope" AS ENUM ('GLOBAL', 'USER');

-- CreateTable
CREATE TABLE "countries" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "country_code" TEXT,
    "scope" "DataScope" NOT NULL,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

------------------ regions -----------------

-- CreateTable
CREATE TABLE "regions" (
    "id" UUID NOT NULL,
    "country_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "region_code" TEXT,
    "scope" "DataScope" NOT NULL,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "regions_country_id_idx" ON "regions"("country_id");

-- CreateIndex
CREATE UNIQUE INDEX "regions_country_id_name_key" ON "regions"("country_id", "name");

-- AddForeignKey
ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regions" ADD CONSTRAINT "regions_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

------------------ cities -----------------

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "region_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "scope" "DataScope" NOT NULL,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cities_region_id_idx" ON "cities"("region_id");

-- CreateIndex
CREATE UNIQUE INDEX "cities_region_id_name_key" ON "cities"("region_id", "name");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

------------------ organizations -----------------

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('SPORT_SCHOOL', 'CLUB', 'UNIVERSITY', 'SPORT_SOCIETY');

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "organization_code" TEXT NOT NULL,
    "name" TEXT,
    "type" "OrganizationType" NOT NULL,
    "scope" "DataScope" NOT NULL,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_organization_code_key" ON "organizations"("organization_code");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

------------------ athletes -----------------

-- CreateEnum
CREATE TYPE "AthleteSex" AS ENUM ('MAN', 'WOMAN');

-- CreateTable
CREATE TABLE "athletes" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "sex" "AthleteSex" NOT NULL,
    "federation_id" UUID NOT NULL,
    "created_by_user_id" UUID,
    "scope" "DataScope" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "athletes_federation_id_full_name_idx" ON "athletes"("federation_id", "full_name");

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

------------------ sport_officials -----------------

-- CreateTable
CREATE TABLE "sport_officials" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "trainer_role" BOOLEAN NOT NULL DEFAULT true,
    "referee_role" BOOLEAN NOT NULL DEFAULT false,
    "federation_id" UUID NOT NULL,
    "created_by_user_id" UUID,
    "scope" "DataScope" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sport_officials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sport_officials_federation_id_idx" ON "sport_officials"("federation_id");

-- CreateIndex
CREATE INDEX "sport_officials_full_name_idx" ON "sport_officials"("full_name");

-- AddForeignKey
ALTER TABLE "sport_officials" ADD CONSTRAINT "sport_officials_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sport_officials" ADD CONSTRAINT "sport_officials_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

------------------ referee_categories -----------------

-- CreateTable
CREATE TABLE "referee_categories" (
    "id" UUID NOT NULL,
    "category_name" TEXT NOT NULL,
    "category_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referee_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referee_categories_category_code_key" ON "referee_categories"("category_code");

------------------ referee_roles -----------------

-- CreateTable
CREATE TABLE "referee_roles" (
    "id" UUID NOT NULL,
    "role_name" TEXT NOT NULL,
    "role_short" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referee_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referee_roles_role_name_key" ON "referee_roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "referee_roles_role_short_key" ON "referee_roles"("role_short");

------------------ user_federations -----------------

-- CreateTable
CREATE TABLE "user_federations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "federation_id" UUID NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_federations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_federations_user_id_federation_id_key" ON "user_federations"("user_id", "federation_id");

-- AddForeignKey
ALTER TABLE "user_federations" ADD CONSTRAINT "user_federations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_federations" ADD CONSTRAINT "user_federations_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

------------------ competitions -----------------

-- CreateEnum
CREATE TYPE "CompetitionLevel" AS ENUM ('INTERNATIONAL', 'NATIONAL', 'REGIONAL_OPEN', 'REGIONAL_ONLY', 'LOCAL_OPEN', 'LOCAL_ONLY');

-- CreateEnum
CREATE TYPE "CompetitionType" AS ENUM ('POWERLIFT', 'BENCH_PRESS');

-- CreateEnum
CREATE TYPE "CompetitionDivision" AS ENUM ('CLASSIC', 'EQUIPPED');

-- CreateEnum
CREATE TYPE "CompetitionStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "competitions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" UUID NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "competition_level" "CompetitionLevel" NOT NULL,
    "type" "CompetitionType" NOT NULL,
    "division" "CompetitionDivision" NOT NULL,
    "status" "CompetitionStatus" NOT NULL DEFAULT 'ACTIVE',
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "competitions_user_id_idx" ON "competitions"("user_id");

-- CreateIndex
CREATE INDEX "competitions_start_date_idx" ON "competitions"("start_date");

-- AddForeignKey
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

------------------ competition_age_groups -----------------

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

------------------ referee_competition -----------------

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "referee_competition" (
    "id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "referee_id" UUID NOT NULL,
    "referee_category_id" UUID NOT NULL,
    "country_id" UUID,
    "region_id" UUID,
    "city_id" UUID,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "referee_competition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referee_competition_competition_id_idx" ON "referee_competition"("competition_id");

-- CreateIndex
CREATE INDEX "referee_competition_referee_id_idx" ON "referee_competition"("referee_id");

-- CreateIndex
CREATE UNIQUE INDEX "referee_competition_competition_id_referee_id_key" ON "referee_competition"("competition_id", "referee_id");

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_referee_id_fkey" FOREIGN KEY ("referee_id") REFERENCES "sport_officials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_referee_category_id_fkey" FOREIGN KEY ("referee_category_id") REFERENCES "referee_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition" ADD CONSTRAINT "referee_competition_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

------------------ referee_competition -----------------



