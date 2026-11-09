-- CreateTable
CREATE TABLE "athlete_titles" (
    "id" UUID NOT NULL,
    "athlete_id" UUID NOT NULL,
    "sport_titles" TEXT,
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "athlete_titles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "athlete_titles_created_by_user_id_idx" ON "athlete_titles"("created_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "athlete_titles_athlete_id_created_by_user_id_key" ON "athlete_titles"("athlete_id", "created_by_user_id");

-- AddForeignKey
ALTER TABLE "athlete_titles" ADD CONSTRAINT "athlete_titles_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
