/*
  Warnings:

  - Added the required column `text` to the `blog_explain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `blog_explain` ADD COLUMN `text` VARCHAR(191) NOT NULL;
