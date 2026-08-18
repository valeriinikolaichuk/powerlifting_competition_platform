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
