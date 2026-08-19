-- DropForeignKey
ALTER TABLE "athlete_nominations" DROP CONSTRAINT "athlete_nominations_created_by_participant_id_fkey";

-- DropForeignKey
ALTER TABLE "referee_nominations" DROP CONSTRAINT "referee_nominations_created_by_participant_id_fkey";

-- AddForeignKey
ALTER TABLE "referee_nominations" ADD CONSTRAINT "referee_nominations_created_by_participant_id_fkey" FOREIGN KEY ("created_by_participant_id") REFERENCES "participants"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_nominations" ADD CONSTRAINT "athlete_nominations_created_by_participant_id_fkey" FOREIGN KEY ("created_by_participant_id") REFERENCES "participants"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
