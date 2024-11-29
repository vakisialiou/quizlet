/*
  Warnings:

  - You are about to drop the column `sort` on the `Term` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Folder` ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Term` DROP COLUMN `sort`,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0;
