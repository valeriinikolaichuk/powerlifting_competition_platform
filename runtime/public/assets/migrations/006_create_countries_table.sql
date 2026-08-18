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
