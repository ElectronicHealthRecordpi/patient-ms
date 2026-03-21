/*
  Warnings:

  - You are about to drop the column `delete` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "delete",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
