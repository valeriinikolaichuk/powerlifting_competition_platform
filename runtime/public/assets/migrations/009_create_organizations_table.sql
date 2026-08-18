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
