-- CreateEnum
CREATE TYPE "NominationStatusType" AS ENUM ('PRELIMINARY', 'FINAL', 'CLOSED');

-- CreateTable
CREATE TABLE "nomination_status" (
    "id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "preliminary_date" TIMESTAMP(3),
    "final_date" TIMESTAMP(3),
    "status" "NominationStatusType" NOT NULL DEFAULT 'PRELIMINARY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nomination_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nomination_status_competition_id_key" ON "nomination_status"("competition_id");

-- AddForeignKey
ALTER TABLE "nomination_status" ADD CONSTRAINT "nomination_status_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
