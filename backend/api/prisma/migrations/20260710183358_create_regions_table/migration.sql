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
