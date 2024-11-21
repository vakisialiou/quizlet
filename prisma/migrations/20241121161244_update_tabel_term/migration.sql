-- AlterTable
ALTER TABLE `Term` MODIFY `answerLang` VARCHAR(5) NULL DEFAULT 'en-GB',
    MODIFY `questionLang` VARCHAR(5) NULL DEFAULT 'ru-RU';
