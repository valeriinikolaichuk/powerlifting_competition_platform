/*
  Warnings:

  - Added the required column `default_team_scoring_limit` to the `federation_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "federation_categories" ADD COLUMN     "default_team_scoring_limit" INTEGER NOT NULL;
