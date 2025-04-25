-- DropForeignKey
ALTER TABLE `blog_comment` DROP FOREIGN KEY `blog_comment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `blog_like` DROP FOREIGN KEY `blog_like_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `blog_sub_comment` DROP FOREIGN KEY `blog_sub_comment_user_id_fkey`;

-- DropIndex
DROP INDEX `blog_comment_user_id_fkey` ON `blog_comment`;

-- DropIndex
DROP INDEX `blog_like_user_id_fkey` ON `blog_like`;

-- DropIndex
DROP INDEX `blog_sub_comment_user_id_fkey` ON `blog_sub_comment`;

-- AddForeignKey
ALTER TABLE `blog_comment` ADD CONSTRAINT `blog_comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `blog_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `blog_sub_comment` ADD CONSTRAINT `blog_sub_comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `blog_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `blog_like` ADD CONSTRAINT `blog_like_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `blog_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
