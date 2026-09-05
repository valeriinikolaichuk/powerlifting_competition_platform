-- CreateTable
CREATE TABLE "federation_age_subgroups" (
    "id" UUID NOT NULL,
    "federation_category_id" UUID NOT NULL,
    "age_group_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "federation_age_subgroups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "federation_age_subgroups_federation_category_id_age_group_i_key" ON "federation_age_subgroups"("federation_category_id", "age_group_id");

-- AddForeignKey
ALTER TABLE "federation_age_subgroups" ADD CONSTRAINT "federation_age_subgroups_federation_category_id_fkey" FOREIGN KEY ("federation_category_id") REFERENCES "federation_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "federation_age_subgroups" ADD CONSTRAINT "federation_age_subgroups_age_group_id_fkey" FOREIGN KEY ("age_group_id") REFERENCES "age_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
