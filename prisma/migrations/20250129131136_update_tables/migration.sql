/*
  Warnings:

  - You are about to drop the column `color` on the `RelationFolder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `RelationFolder` DROP COLUMN `color`;

-- AlterTable
ALTER TABLE `RelationTerm` ADD COLUMN `color` INTEGER NOT NULL DEFAULT 0;
