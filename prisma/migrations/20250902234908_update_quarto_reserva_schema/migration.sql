/*
  Warnings:

  - You are about to drop the column `dataFim` on the `Quarto` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `Quarto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Quarto" DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Reserva" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "stayDuration" INTEGER;
