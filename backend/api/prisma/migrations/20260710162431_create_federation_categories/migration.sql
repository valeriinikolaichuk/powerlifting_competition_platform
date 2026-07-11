-- CreateTable
CREATE TABLE "federation_categories" (
    "id" UUID NOT NULL,
    "federation_id" UUID NOT NULL,
    "age_group_id" UUID NOT NULL,
    "weight_class_group" INTEGER NOT NULL,
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
