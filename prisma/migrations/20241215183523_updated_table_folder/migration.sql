-- AlterTable
ALTER TABLE `Folder` ADD COLUMN `parentId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
