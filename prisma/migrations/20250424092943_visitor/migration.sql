-- AlterTable
ALTER TABLE `blog_comment` ADD COLUMN `visitorName` VARCHAR(191) NULL,
    MODIFY `user_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `blog_sub_comment` MODIFY `user_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `blog_user` ADD COLUMN `website` VARCHAR(191) NULL;
