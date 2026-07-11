-- CreateTable
CREATE TABLE "sport_officials" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "trainer_role" BOOLEAN NOT NULL DEFAULT true,
    "referee_role" BOOLEAN NOT NULL DEFAULT false,
    "federation_id" UUID NOT NULL,
    "created_by_user_id" UUID,
    "scope" "DataScope" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sport_officials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sport_officials_federation_id_idx" ON "sport_officials"("federation_id");

-- CreateIndex
CREATE INDEX "sport_officials_full_name_idx" ON "sport_officials"("full_name");

-- AddForeignKey
ALTER TABLE "sport_officials" ADD CONSTRAINT "sport_officials_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sport_officials" ADD CONSTRAINT "sport_officials_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
