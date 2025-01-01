-- CreateTable
CREATE TABLE `FolderShare` (
    `id` VARCHAR(191) NOT NULL,
    `ownerUserId` VARCHAR(36) NOT NULL,
    `folderId` VARCHAR(36) NOT NULL,
    `access` ENUM('public', 'readonly', 'editable') NOT NULL DEFAULT 'readonly',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FolderShare_id_key`(`id`),
    UNIQUE INDEX `FolderShare_id_ownerUserId_folderId_key`(`id`, `ownerUserId`, `folderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FolderShare` ADD CONSTRAINT `FolderShare_ownerUserId_fkey` FOREIGN KEY (`ownerUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FolderShare` ADD CONSTRAINT `FolderShare_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
