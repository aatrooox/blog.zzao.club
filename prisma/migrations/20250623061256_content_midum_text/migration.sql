-- AlterTable
ALTER TABLE `blog_comment` MODIFY `content` MEDIUMTEXT NOT NULL;

-- AlterTable
ALTER TABLE `blog_explain` MODIFY `content` MEDIUMTEXT NOT NULL,
    MODIFY `text` MEDIUMTEXT NOT NULL;

-- AlterTable
ALTER TABLE `blog_memos` MODIFY `content` MEDIUMTEXT NULL;

-- AlterTable
ALTER TABLE `blog_sub_comment` MODIFY `content` MEDIUMTEXT NOT NULL;
