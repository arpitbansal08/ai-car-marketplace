/*
  Warnings:

  - The values [TRUCK,MINIVAN] on the enum `CarType` will be removed. If these variants are still used in the database, this will fail.
  - The values [CONFIRMED,CANCELLED] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `transmission` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `zipCode` on the `CarSeller` table. All the data in the column will be lost.
  - You are about to drop the column `engineCap` on the `CarSpecification` table. All the data in the column will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[carId,userId]` on the table `TestDriveRequest` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Transmission" AS ENUM ('MANUAL', 'AUTOMATIC');

-- AlterEnum
BEGIN;
CREATE TYPE "CarType_new" AS ENUM ('SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'PICKUP', 'VAN', 'WAGON', 'CROSSOVER', 'SPORTS');
ALTER TABLE "Car" ALTER COLUMN "type" TYPE "CarType_new" USING ("type"::text::"CarType_new");
ALTER TYPE "CarType" RENAME TO "CarType_old";
ALTER TYPE "CarType_new" RENAME TO "CarType";
DROP TYPE "CarType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "TestDriveRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TestDriveRequest" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "RequestStatus_old";
ALTER TABLE "TestDriveRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropIndex
DROP INDEX "TestDriveRequest_carId_userId_date_key";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "transmission",
ADD COLUMN     "transmission" "Transmission" DEFAULT 'MANUAL';

-- AlterTable
ALTER TABLE "CarSeller" DROP COLUMN "zipCode",
ADD COLUMN     "postalCode" TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CarSpecification" DROP COLUMN "engineCap",
ADD COLUMN     "engineCapacity" INTEGER,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "phone" SET NOT NULL;

-- DropTable
DROP TABLE "VerificationToken";

-- DropEnum
DROP TYPE "TransmissionType";

-- CreateIndex
CREATE UNIQUE INDEX "TestDriveRequest_carId_userId_key" ON "TestDriveRequest"("carId", "userId");
