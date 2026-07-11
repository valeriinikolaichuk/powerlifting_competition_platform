-- CreateEnum
CREATE TYPE "AthleteSex" AS ENUM ('MAN', 'WOMAN');

-- CreateTable
CREATE TABLE "athletes" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "sex" "AthleteSex" NOT NULL,
    "federation_id" UUID NOT NULL,
    "created_by_user_id" UUID,
    "scope" "DataScope" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "athletes_federation_id_full_name_idx" ON "athletes"("federation_id", "full_name");

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
