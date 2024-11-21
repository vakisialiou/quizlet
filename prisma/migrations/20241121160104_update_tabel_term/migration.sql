-- AlterTable
ALTER TABLE `Term` ADD COLUMN `answerLang` VARCHAR(5) NULL DEFAULT 'ru-RU',
    ADD COLUMN `questionLang` VARCHAR(5) NULL DEFAULT 'en-GB';
