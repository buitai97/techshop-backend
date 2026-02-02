/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `paymentStatus`,
    DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `payments` ADD COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'COMPLETED';
