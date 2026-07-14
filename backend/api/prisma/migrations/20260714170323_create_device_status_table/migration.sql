-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'UK', 'PL');

-- CreateEnum
CREATE TYPE "DeviceRole" AS ENUM ('ADMIN', 'SCOREBOARD', 'LIFTING_ORDER', 'DISCS_SEQUENCE', 'INFORMATION', 'TIMER', 'WEIGHING_IN');

-- CreateTable
CREATE TABLE "device_status" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "language" "Language" NOT NULL,
    "device_role" "DeviceRole" NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "device_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "device_status_user_id_idx" ON "device_status"("user_id");

-- AddForeignKey
ALTER TABLE "device_status" ADD CONSTRAINT "device_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
