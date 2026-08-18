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
