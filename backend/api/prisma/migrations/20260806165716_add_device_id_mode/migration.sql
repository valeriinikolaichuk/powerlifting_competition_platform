/*
  Warnings:

  - Added the required column `device_id` to the `device_status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `device_status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_id` to the `installations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeviceMode" AS ENUM ('LAN', 'ONLINE');

-- AlterTable
ALTER TABLE "device_status" ADD COLUMN     "device_id" UUID NOT NULL,
ADD COLUMN     "mode" "DeviceMode" NOT NULL;

-- AlterTable
ALTER TABLE "installations" ADD COLUMN     "device_id" UUID NOT NULL;
