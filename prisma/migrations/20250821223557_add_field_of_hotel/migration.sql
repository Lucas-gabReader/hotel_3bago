/*
  Warnings:

  - Added the required column `hotelId` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Reserva" ADD COLUMN     "hotelId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "public"."Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
