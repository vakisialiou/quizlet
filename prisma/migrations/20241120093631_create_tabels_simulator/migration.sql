-- CreateTable
CREATE TABLE `Simulator` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `folderId` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `duration` INTEGER NULL,
    `status` ENUM('processing', 'finishing', 'waiting', 'done') NOT NULL,
    `termId` VARCHAR(191) NULL,
    `termIds` JSON NOT NULL,
    `rememberIds` JSON NOT NULL,
    `continueIds` JSON NOT NULL,
    `historyIds` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Simulator_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Simulator` ADD CONSTRAINT `Simulator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulator` ADD CONSTRAINT `Simulator_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
