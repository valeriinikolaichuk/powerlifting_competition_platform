/*
  Warnings:

  - Added the required column `updated_at` to the `coefficients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `federation_coefficients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coefficients" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "federation_coefficients" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
