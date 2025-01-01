/*
  Warnings:

  - The values [public] on the enum `FolderShare_access` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[folderId,access]` on the table `FolderShare` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `FolderShare_id_ownerUserId_folderId_key` ON `FolderShare`;

-- AlterTable
ALTER TABLE `FolderShare` MODIFY `access` ENUM('readonly', 'editable') NOT NULL DEFAULT 'readonly';

-- CreateIndex
CREATE INDEX `FolderShare_ownerUserId_id_idx` ON `FolderShare`(`ownerUserId`, `id`);

-- CreateIndex
CREATE UNIQUE INDEX `FolderShare_folderId_access_key` ON `FolderShare`(`folderId`, `access`);
