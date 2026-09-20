-- CreateTable
CREATE TABLE "sync_processed" (
    "sync_id" UUID PRIMARY KEY,
    "processed_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
