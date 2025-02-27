-- CreateTable
CREATE TABLE `blog_user` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatar_url` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',

    UNIQUE INDEX `blog_user_username_key`(`username`),
    UNIQUE INDEX `blog_user_nickname_key`(`nickname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_oauth` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `providerToken` VARCHAR(191) NULL,
    `providerRefreshToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_oauth_provider_providerId_key`(`provider`, `providerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_comment` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `create_ts` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_ts` DATETIME(3) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'article',
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_sub_comment` (
    `id` VARCHAR(191) NOT NULL,
    `uid` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `create_ts` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_ts` DATETIME(3) NOT NULL,
    `comment_id` VARCHAR(191) NOT NULL,
    `reply_sub_comment_id` INTEGER NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `memo_id` INTEGER NULL,

    UNIQUE INDEX `blog_sub_comment_uid_key`(`uid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_ts` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_ts` DATETIME(3) NOT NULL,
    `target` VARCHAR(191) NOT NULL DEFAULT 'article',
    `sub_comment_id` VARCHAR(191) NULL,
    `comment_id` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog_oauth` ADD CONSTRAINT `blog_oauth_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `blog_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_comment` ADD CONSTRAINT `blog_comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `blog_user`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_sub_comment` ADD CONSTRAINT `blog_sub_comment_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `blog_comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_sub_comment` ADD CONSTRAINT `blog_sub_comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `blog_user`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_like` ADD CONSTRAINT `blog_like_sub_comment_id_fkey` FOREIGN KEY (`sub_comment_id`) REFERENCES `blog_sub_comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_like` ADD CONSTRAINT `blog_like_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `blog_comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_like` ADD CONSTRAINT `blog_like_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `blog_user`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
