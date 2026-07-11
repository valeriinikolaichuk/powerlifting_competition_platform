-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MEN', 'WOMEN');

-- CreateTable
CREATE TABLE "age_groups" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "age_from" INTEGER NOT NULL,
    "age_to" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "age_groups_pkey" PRIMARY KEY ("id")
);
