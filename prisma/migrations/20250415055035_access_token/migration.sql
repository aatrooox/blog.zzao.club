-- CreateTable
CREATE TABLE `blog_access_token` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `roles` VARCHAR(191) NOT NULL DEFAULT 'user',
    `status` INTEGER NOT NULL DEFAULT 1,
    `scope` VARCHAR(191) NOT NULL DEFAULT 'all',
    `isRevoked` BOOLEAN NOT NULL DEFAULT false,
    `ip` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_access_token_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog_access_token` ADD CONSTRAINT `blog_access_token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `blog_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
