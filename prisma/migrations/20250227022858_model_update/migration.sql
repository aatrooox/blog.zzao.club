/*
  Warnings:

  - Added the required column `providerUnionId` to the `blog_oauth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `blog_oauth` ADD COLUMN `providerUnionId` VARCHAR(191) NOT NULL;
