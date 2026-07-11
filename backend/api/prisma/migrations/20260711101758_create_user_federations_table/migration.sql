-- CreateTable
CREATE TABLE "user_federations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "federation_id" UUID NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_federations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_federations_user_id_federation_id_key" ON "user_federations"("user_id", "federation_id");

-- AddForeignKey
ALTER TABLE "user_federations" ADD CONSTRAINT "user_federations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_federations" ADD CONSTRAINT "user_federations_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
