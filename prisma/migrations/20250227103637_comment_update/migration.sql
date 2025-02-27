/*
  Warnings:

  - You are about to drop the column `memo_id` on the `blog_sub_comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `blog_sub_comment` DROP COLUMN `memo_id`,
    MODIFY `reply_sub_comment_id` VARCHAR(191) NULL;
