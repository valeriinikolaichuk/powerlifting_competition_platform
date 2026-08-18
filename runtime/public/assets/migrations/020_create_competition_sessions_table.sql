-- CreateEnum
CREATE TYPE "CompetitionSessionStatus" AS ENUM ('CREATED', 'READY');

-- CreateTable
CREATE TABLE "competition_sessions" (
    "id" UUID NOT NULL,
    "competition_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_of_weighing_in" TIMESTAMP(3),
    "status" "CompetitionSessionStatus" NOT NULL DEFAULT 'CREATED',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "competition_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "competition_sessions_competition_id_name_key" ON "competition_sessions"("competition_id", "name");

-- AddForeignKey
ALTER TABLE "competition_sessions" ADD CONSTRAINT "competition_sessions_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
