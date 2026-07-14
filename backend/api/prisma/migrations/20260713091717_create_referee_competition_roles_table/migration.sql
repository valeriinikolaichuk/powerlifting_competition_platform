-- CreateTable
CREATE TABLE "referee_competition_roles" (
    "id" UUID NOT NULL,
    "competition_session_id" UUID NOT NULL,
    "referee_competition_id" UUID NOT NULL,
    "referee_role_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "referee_competition_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referee_competition_roles_competition_session_id_idx" ON "referee_competition_roles"("competition_session_id");

-- CreateIndex
CREATE INDEX "referee_competition_roles_referee_competition_id_idx" ON "referee_competition_roles"("referee_competition_id");

-- AddForeignKey
ALTER TABLE "referee_competition_roles" ADD CONSTRAINT "referee_competition_roles_competition_session_id_fkey" FOREIGN KEY ("competition_session_id") REFERENCES "competition_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition_roles" ADD CONSTRAINT "referee_competition_roles_referee_competition_id_fkey" FOREIGN KEY ("referee_competition_id") REFERENCES "referee_competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referee_competition_roles" ADD CONSTRAINT "referee_competition_roles_referee_role_id_fkey" FOREIGN KEY ("referee_role_id") REFERENCES "referee_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
