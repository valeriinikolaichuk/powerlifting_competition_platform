/*
  Warnings:

  - Added the required column `runtime_version_id` to the `installations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "installations" ADD COLUMN     "runtime_version_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "runtime_versions" (
    "id" UUID NOT NULL,
    "application_version" TEXT NOT NULL,
    "data_version" INTEGER NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "runtime_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "runtime_versions_application_version_key" ON "runtime_versions"("application_version");

-- CreateIndex
CREATE INDEX "installations_runtime_version_id_idx" ON "installations"("runtime_version_id");

-- AddForeignKey
ALTER TABLE "installations" ADD CONSTRAINT "installations_runtime_version_id_fkey" FOREIGN KEY ("runtime_version_id") REFERENCES "runtime_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
