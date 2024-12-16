-- AlterTable
ALTER TABLE `Folder` ADD COLUMN `collapsed` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Term` MODIFY `answerLang` VARCHAR(5) NULL DEFAULT 'en',
    MODIFY `questionLang` VARCHAR(5) NULL DEFAULT 'ru',
    MODIFY `associationLang` VARCHAR(5) NULL DEFAULT 'en';

-- CreateTable
CREATE TABLE `RelationTerm` (
    `id` VARCHAR(191) NOT NULL,
    `termId` VARCHAR(36) NOT NULL,
    `folderId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RelationTerm_id_key`(`id`),
    UNIQUE INDEX `RelationTerm_termId_folderId_key`(`termId`, `folderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RelationFolder` (
    `id` VARCHAR(191) NOT NULL,
    `folderId` VARCHAR(36) NOT NULL,
    `folderGroupId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RelationFolder_id_key`(`id`),
    UNIQUE INDEX `RelationFolder_folderId_folderGroupId_key`(`folderId`, `folderGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FolderGroup` (
    `id` VARCHAR(191) NOT NULL,
    `folderId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FolderGroup_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RelationTerm` ADD CONSTRAINT `RelationTerm_termId_fkey` FOREIGN KEY (`termId`) REFERENCES `Term`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationTerm` ADD CONSTRAINT `RelationTerm_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationFolder` ADD CONSTRAINT `RelationFolder_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelationFolder` ADD CONSTRAINT `RelationFolder_folderGroupId_fkey` FOREIGN KEY (`folderGroupId`) REFERENCES `FolderGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FolderGroup` ADD CONSTRAINT `FolderGroup_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
