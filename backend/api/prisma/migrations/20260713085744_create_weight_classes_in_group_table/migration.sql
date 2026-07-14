-- CreateTable
CREATE TABLE "weight_classes_in_group" (
    "id" UUID NOT NULL,
    "groups_in_session_id" UUID NOT NULL,
    "weight_class_id" UUID NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "weight_classes_in_group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "weight_classes_in_group_groups_in_session_id_weight_class_i_key" ON "weight_classes_in_group"("groups_in_session_id", "weight_class_id");

-- AddForeignKey
ALTER TABLE "weight_classes_in_group" ADD CONSTRAINT "weight_classes_in_group_groups_in_session_id_fkey" FOREIGN KEY ("groups_in_session_id") REFERENCES "groups_in_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weight_classes_in_group" ADD CONSTRAINT "weight_classes_in_group_weight_class_id_fkey" FOREIGN KEY ("weight_class_id") REFERENCES "weight_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
