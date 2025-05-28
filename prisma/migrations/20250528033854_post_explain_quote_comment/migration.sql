/*
  Warnings:

  - You are about to drop the column `endAnchor` on the `blog_comment` table. All the data in the column will be lost.
  - You are about to drop the column `fullText` on the `blog_comment` table. All the data in the column will be lost.
  - You are about to drop the column `startAnchor` on the `blog_comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `blog_comment` DROP COLUMN `endAnchor`,
    DROP COLUMN `fullText`,
    DROP COLUMN `startAnchor`,
    ADD COLUMN `quoteContent` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `blog_explain` (
    `id` VARCHAR(191) NOT NULL,
    `create_ts` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_ts` DATETIME(3) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `article_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
