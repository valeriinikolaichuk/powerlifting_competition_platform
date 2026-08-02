-- CreateTable
CREATE TABLE "installations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "language" "Language" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "installations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "installations_user_id_idx" ON "installations"("user_id");

-- AddForeignKey
ALTER TABLE "installations" ADD CONSTRAINT "installations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
