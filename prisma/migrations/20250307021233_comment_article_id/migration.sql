/*
  Warnings:

  - You are about to drop the column `acticle_id` on the `blog_comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `blog_comment` DROP COLUMN `acticle_id`,
    ADD COLUMN `article_id` VARCHAR(191) NULL;
