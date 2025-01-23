-- AlterTable
ALTER TABLE `Settings` ADD COLUMN `modules` JSON NULL,
    MODIFY `simulator` JSON NULL;
