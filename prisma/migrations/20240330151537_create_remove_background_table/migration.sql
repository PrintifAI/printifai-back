-- CreateTable
CREATE TABLE "RemoveBackground" (
    "predictionId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "status" "PredictionStatus" NOT NULL DEFAULT 'Created',
    "output" BYTEA,
    "predictionTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "RemoveBackground_externalId_key" ON "RemoveBackground"("externalId");

-- AddForeignKey
ALTER TABLE "RemoveBackground" ADD CONSTRAINT "RemoveBackground_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "Prediction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
