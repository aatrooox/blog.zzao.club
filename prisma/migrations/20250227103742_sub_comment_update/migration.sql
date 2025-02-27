/*
  Warnings:

  - You are about to drop the column `uid` on the `blog_sub_comment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `blog_sub_comment_uid_key` ON `blog_sub_comment`;

-- AlterTable
ALTER TABLE `blog_sub_comment` DROP COLUMN `uid`;
