-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Created', 'Producing', 'Sending', 'Sent', 'Returned', 'Completed');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'Created';
