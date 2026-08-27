-- Rename columns
ALTER TABLE "competitions"
RENAME COLUMN "user_id" TO "created_by_user_id";

ALTER TABLE "device_status"
RENAME COLUMN "user_id" TO "created_by_user_id";

ALTER TABLE "global_state"
RENAME COLUMN "user_id" TO "created_by_user_id";

-- Rename indexes
ALTER INDEX "competitions_user_id_idx"
RENAME TO "competitions_created_by_user_id_idx";

ALTER INDEX "device_status_user_id_idx"
RENAME TO "device_status_created_by_user_id_idx";

-- Rename foreign keys
ALTER TABLE "competitions"
RENAME CONSTRAINT "competitions_user_id_fkey"
TO "competitions_created_by_user_id_fkey";

ALTER TABLE "device_status"
RENAME CONSTRAINT "device_status_user_id_fkey"
TO "device_status_created_by_user_id_fkey";

ALTER TABLE "global_state"
RENAME CONSTRAINT "global_state_user_id_fkey"
TO "global_state_created_by_user_id_fkey";
