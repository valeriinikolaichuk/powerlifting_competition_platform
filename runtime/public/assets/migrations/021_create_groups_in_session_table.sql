-- CreateTable
CREATE TABLE "groups_in_session" (
    "id" UUID NOT NULL,
    "competition_session_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "groups_in_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_in_session_competition_session_id_order_key" ON "groups_in_session"("competition_session_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "groups_in_session_competition_session_id_name_key" ON "groups_in_session"("competition_session_id", "name");

-- AddForeignKey
ALTER TABLE "groups_in_session" ADD CONSTRAINT "groups_in_session_competition_session_id_fkey" FOREIGN KEY ("competition_session_id") REFERENCES "competition_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
