-- CreateTable
CREATE TABLE "federation_divisions" (
    "id" UUID NOT NULL,
    "federation_id" UUID NOT NULL,
    "division" "CompetitionDivision" NOT NULL,
    "name" TEXT,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "federation_divisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "federation_divisions_federation_id_division_key" ON "federation_divisions"("federation_id", "division");

-- AddForeignKey
ALTER TABLE "federation_divisions" ADD CONSTRAINT "federation_divisions_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  