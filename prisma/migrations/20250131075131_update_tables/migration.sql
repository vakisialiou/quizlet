/*
  Warnings:

  - You are about to drop the column `color` on the `Term` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `RelationTerm` MODIFY `color` INTEGER NOT NULL DEFAULT -1;

-- AlterTable
ALTER TABLE `Settings` ADD COLUMN `terms` JSON NULL;

-- AlterTable
ALTER TABLE `Term` DROP COLUMN `color`;
