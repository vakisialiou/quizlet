-- DropForeignKey
ALTER TABLE `Folder` DROP FOREIGN KEY `Folder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `FolderGroup` DROP FOREIGN KEY `FolderGroup_moduleId_fkey`;

-- DropForeignKey
ALTER TABLE `FolderGroup` DROP FOREIGN KEY `FolderGroup_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Module` DROP FOREIGN KEY `Module_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ModuleShare` DROP FOREIGN KEY `ModuleShare_moduleId_fkey`;

-- DropForeignKey
ALTER TABLE `ModuleShare` DROP FOREIGN KEY `ModuleShare_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationFolder` DROP FOREIGN KEY `RelationFolder_folderId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationFolder` DROP FOREIGN KEY `RelationFolder_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationFolder` DROP FOREIGN KEY `RelationFolder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationSimulator` DROP FOREIGN KEY `RelationSimulator_folderId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationSimulator` DROP FOREIGN KEY `RelationSimulator_moduleId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationSimulator` DROP FOREIGN KEY `RelationSimulator_simulatorId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationSimulator` DROP FOREIGN KEY `RelationSimulator_userId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationTerm` DROP FOREIGN KEY `RelationTerm_folderId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationTerm` DROP FOREIGN KEY `RelationTerm_moduleId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationTerm` DROP FOREIGN KEY `RelationTerm_termId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationTerm` DROP FOREIGN KEY `RelationTerm_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Settings` DROP FOREIGN KEY `Settings_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Simulator` DROP FOREIGN KEY `Simulator_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Term` DROP FOREIGN KEY `Term_userId_fkey`;

-- DropIndex
DROP INDEX `FolderGroup_moduleId_fkey` ON `FolderGroup`;

-- DropIndex
DROP INDEX `RelationFolder_folderId_fkey` ON `RelationFolder`;

-- DropIndex
DROP INDEX `RelationSimulator_simulatorId_fkey` ON `RelationSimulator`;

-- DropIndex
DROP INDEX `RelationTerm_termId_fkey` ON `RelationTerm`;

-- AddForeignKey
ALTER TABLE `Term` ADD CONSTRAINT `Term_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulator` ADD CONSTRAINT `Simulator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Module` ADD CONSTRAINT `Module_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FolderGroup` ADD CONSTRAINT `FolderGroup_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FolderGroup` ADD CONSTRAINT `FolderGroup_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationFolder` ADD CONSTRAINT `RelationFolder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationFolder` ADD CONSTRAINT `RelationFolder_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationFolder` ADD CONSTRAINT `RelationFolder_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `FolderGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationSimulator` ADD CONSTRAINT `RelationSimulator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationSimulator` ADD CONSTRAINT `RelationSimulator_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationSimulator` ADD CONSTRAINT `RelationSimulator_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationSimulator` ADD CONSTRAINT `RelationSimulator_simulatorId_fkey` FOREIGN KEY (`simulatorId`) REFERENCES `Simulator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationTerm` ADD CONSTRAINT `RelationTerm_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationTerm` ADD CONSTRAINT `RelationTerm_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationTerm` ADD CONSTRAINT `RelationTerm_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationTerm` ADD CONSTRAINT `RelationTerm_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Settings` ADD CONSTRAINT `Settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleShare` ADD CONSTRAINT `ModuleShare_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleShare` ADD CONSTRAINT `ModuleShare_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
