/*
  Warnings:

  - You are about to drop the column `termsCollapsed` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `groupsCollapsed` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `termsCollapsed` on the `Module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Folder` DROP COLUMN `termsCollapsed`;

-- AlterTable
ALTER TABLE `Module` DROP COLUMN `groupsCollapsed`,
    DROP COLUMN `termsCollapsed`,
    ADD COLUMN `activeTab` INTEGER NOT NULL DEFAULT 1;
