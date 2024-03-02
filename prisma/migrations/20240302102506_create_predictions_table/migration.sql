-- CreateEnum
CREATE TYPE "PredictionStatus" AS ENUM ('Created', 'Failed', 'Ready');

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "sourcePrompt" TEXT NOT NULL,
    "translatedPrompt" TEXT NOT NULL,
    "predictionId" TEXT NOT NULL,
    "output" BYTEA,
    "predictionTime" INTEGER,
    "status" "PredictionStatus" NOT NULL DEFAULT 'Created',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_predictionId_key" ON "Prediction"("predictionId");
