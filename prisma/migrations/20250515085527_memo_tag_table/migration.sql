-- AlterTable
ALTER TABLE `blog_comment` ADD COLUMN `memo_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `blog_like` ADD COLUMN `blogMemoId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `blog_memos` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `create_ts` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_ts` DATETIME(3) NOT NULL,
    `visible` VARCHAR(191) NOT NULL DEFAULT 'public',
    `defalt_floded` BOOLEAN NOT NULL DEFAULT false,
    `flod_tip` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_memo_tag` (
    `id` VARCHAR(191) NOT NULL,
    `tag_name` VARCHAR(191) NOT NULL,
    `create_ts` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_ts` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `blog_memo_tag_tag_name_key`(`tag_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_memo_tag_relations` (
    `tagId` VARCHAR(191) NOT NULL,
    `memoId` VARCHAR(191) NOT NULL,
    `create_ts` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_ts` DATETIME(3) NOT NULL,

    PRIMARY KEY (`tagId`, `memoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog_comment` ADD CONSTRAINT `blog_comment_memo_id_fkey` FOREIGN KEY (`memo_id`) REFERENCES `blog_memos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_like` ADD CONSTRAINT `blog_like_blogMemoId_fkey` FOREIGN KEY (`blogMemoId`) REFERENCES `blog_memos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_memos` ADD CONSTRAINT `blog_memos_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `blog_user`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_memo_tag` ADD CONSTRAINT `blog_memo_tag_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `blog_user`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_memo_tag_relations` ADD CONSTRAINT `blog_memo_tag_relations_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `blog_memo_tag`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_memo_tag_relations` ADD CONSTRAINT `blog_memo_tag_relations_memoId_fkey` FOREIGN KEY (`memoId`) REFERENCES `blog_memos`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
