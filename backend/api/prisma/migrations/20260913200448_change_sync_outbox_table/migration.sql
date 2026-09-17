/*
  Warnings:

  - A unique constraint covering the columns `[sync_id,device_id]` on the table `sync_outbox` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sync_id` to the `sync_outbox` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "sync_outbox_device_id_idx";

-- DropIndex
DROP INDEX "sync_outbox_processed_at_idx";

-- AlterTable
ALTER TABLE "sync_outbox" ADD COLUMN     "sync_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sync_outbox_sync_id_device_id_key" ON "sync_outbox"("sync_id", "device_id");
