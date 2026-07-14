-- CreateTable
CREATE TABLE "global_state" (
    "id" UUID NOT NULL,
    "competition_id" UUID,
    "competition_session_id" UUID,
    "groups_in_session_id" UUID,
    "current_discipline" "LiftType",
    "current_attempt" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "global_state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "global_state_competition_id_idx" ON "global_state"("competition_id");

-- CreateIndex
CREATE INDEX "global_state_competition_session_id_idx" ON "global_state"("competition_session_id");

-- CreateIndex
CREATE INDEX "global_state_groups_in_session_id_idx" ON "global_state"("groups_in_session_id");

-- AddForeignKey
ALTER TABLE "global_state" ADD CONSTRAINT "global_state_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_state" ADD CONSTRAINT "global_state_competition_session_id_fkey" FOREIGN KEY ("competition_session_id") REFERENCES "competition_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_state" ADD CONSTRAINT "global_state_groups_in_session_id_fkey" FOREIGN KEY ("groups_in_session_id") REFERENCES "groups_in_session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
