-- CreateTable
CREATE TABLE "sync_outbox" (
    "id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "operation_id" TEXT NOT NULL,
    "record_id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "sync_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sync_outbox_device_id_idx" ON "sync_outbox"("device_id");

-- CreateIndex
CREATE INDEX "sync_outbox_processed_at_idx" ON "sync_outbox"("processed_at");

-- CreateIndex
CREATE INDEX "sync_outbox_device_id_processed_at_idx" ON "sync_outbox"("device_id", "processed_at");
