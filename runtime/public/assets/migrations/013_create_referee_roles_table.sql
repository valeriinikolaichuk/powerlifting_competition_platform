-- CreateTable
CREATE TABLE "referee_roles" (
    "id" UUID NOT NULL,
    "role_name" TEXT NOT NULL,
    "role_short" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referee_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referee_roles_role_name_key" ON "referee_roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "referee_roles_role_short_key" ON "referee_roles"("role_short");
