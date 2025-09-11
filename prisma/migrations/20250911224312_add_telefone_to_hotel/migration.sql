/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Hotel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Hotel" DROP COLUMN "createdAt",
ALTER COLUMN "telefone" DROP DEFAULT;
