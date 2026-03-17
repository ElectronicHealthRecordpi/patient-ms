/*
  Warnings:

  - Changed the type of `name` on the `Gender` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- AlterTable
ALTER TABLE "Gender" DROP COLUMN "name",
ADD COLUMN     "name" "GenderEnum" NOT NULL;
