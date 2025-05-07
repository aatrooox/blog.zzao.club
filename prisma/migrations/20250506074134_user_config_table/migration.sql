-- CreateTable
CREATE TABLE `blog_user_config` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `allowEmailNotify` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_user_config_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog_user_config` ADD CONSTRAINT `blog_user_config_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `blog_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
