-- AlterTable
ALTER TABLE `blog_comment` ADD COLUMN `endAnchor` VARCHAR(191) NULL,
    ADD COLUMN `fullText` VARCHAR(191) NULL,
    ADD COLUMN `startAnchor` VARCHAR(191) NULL;
