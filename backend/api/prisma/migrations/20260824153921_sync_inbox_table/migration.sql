-- CreateTable
CREATE TABLE "sync_inbox" (
    "id" UUID NOT NULL,
    "source_id" UUID NOT NULL,
    "operation_id" TEXT NOT NULL,
    "record_id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "sync_inbox_pkey" PRIMARY KEY ("id")
);
