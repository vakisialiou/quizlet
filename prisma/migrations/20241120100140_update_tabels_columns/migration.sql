/*
  Warnings:

  - You are about to alter the column `userId` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `userId` on the `Folder` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `userId` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `userId` on the `Simulator` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `folderId` on the `Simulator` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `status` on the `Simulator` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(20)`.
  - You are about to alter the column `termId` on the `Simulator` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `userId` on the `Term` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.
  - You are about to alter the column `folderId` on the `Term` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Folder` DROP FOREIGN KEY `Folder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Simulator` DROP FOREIGN KEY `Simulator_folderId_fkey`;

-- DropForeignKey
ALTER TABLE `Simulator` DROP FOREIGN KEY `Simulator_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Term` DROP FOREIGN KEY `Term_folderId_fkey`;

-- DropForeignKey
ALTER TABLE `Term` DROP FOREIGN KEY `Term_userId_fkey`;

-- DropIndex
DROP INDEX `Account_userId_key` ON `Account`;

-- AlterTable
ALTER TABLE `Account` MODIFY `userId` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `Folder` MODIFY `userId` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `Session` MODIFY `userId` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `Simulator` MODIFY `userId` VARCHAR(36) NOT NULL,
    MODIFY `folderId` VARCHAR(36) NOT NULL,
    MODIFY `status` VARCHAR(20) NOT NULL,
    MODIFY `termId` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `Term` MODIFY `userId` VARCHAR(36) NOT NULL,
    MODIFY `folderId` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Term` ADD CONSTRAINT `Term_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Term` ADD CONSTRAINT `Term_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulator` ADD CONSTRAINT `Simulator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulator` ADD CONSTRAINT `Simulator_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
