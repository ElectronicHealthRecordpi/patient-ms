/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `name` on the `BloodType` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_patientId_fkey";

-- AlterTable
ALTER TABLE "BloodType" DROP COLUMN "name",
ADD COLUMN     "name" "BloodTypeEnum" NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "latitude" DECIMAL(9,6),
ADD COLUMN     "longitude" DECIMAL(9,6);

-- DropTable
DROP TABLE "User";
