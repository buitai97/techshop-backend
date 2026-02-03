/*
  Warnings:

  - Made the column `totalPrice` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `totalPrice` DOUBLE NOT NULL;
