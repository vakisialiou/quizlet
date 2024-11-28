/*
  Warnings:

  - You are about to drop the column `progress` on the `Simulator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Simulator` DROP COLUMN `progress`,
    ADD COLUMN `tracker` JSON NOT NULL;
