/*
  Warnings:

  - Added the required column `sort_order` to the `federation_divisions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "federation_divisions" ADD COLUMN     "sort_order" INTEGER NOT NULL;
