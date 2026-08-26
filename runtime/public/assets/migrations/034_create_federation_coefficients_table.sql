-- CreateTable
CREATE TABLE "federation_coefficients" (
    "id" UUID NOT NULL,
    "federation_id" UUID NOT NULL,
    "coefficient_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "federation_coefficients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coefficients_code_key" ON "coefficients"("code");

-- CreateIndex
CREATE UNIQUE INDEX "federation_coefficients_federation_id_coefficient_id_key" ON "federation_coefficients"("federation_id", "coefficient_id");

-- AddForeignKey
ALTER TABLE "federation_coefficients" ADD CONSTRAINT "federation_coefficients_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "federations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "federation_coefficients" ADD CONSTRAINT "federation_coefficients_coefficient_id_fkey" FOREIGN KEY ("coefficient_id") REFERENCES "coefficients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
