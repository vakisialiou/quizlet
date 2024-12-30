-- AlterTable
ALTER TABLE `Folder` MODIFY `collapsed` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Term` ADD COLUMN `collapsed` BOOLEAN NOT NULL DEFAULT false;
