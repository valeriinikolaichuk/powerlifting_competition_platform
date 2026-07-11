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
