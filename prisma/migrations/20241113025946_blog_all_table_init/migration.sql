/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "b_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "nickname" TEXT,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user'
);

-- CreateTable
CREATE TABLE "b_memos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "nickname" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_memos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "b_articles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "b_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'article',
    "memo_id" INTEGER,
    "article_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_comments_memo_id_fkey" FOREIGN KEY ("memo_id") REFERENCES "b_memos" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "b_comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "b_articles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "b_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "b_sub_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT,
    "content" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "reply_sub_comment_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "memo_id" INTEGER,
    CONSTRAINT "b_sub_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "b_comments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "b_sub_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "target" TEXT NOT NULL DEFAULT 'article',
    "memo_id" INTEGER,
    "article_id" INTEGER,
    "sub_comment_id" INTEGER,
    "comment_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Likes_memo_id_fkey" FOREIGN KEY ("memo_id") REFERENCES "b_memos" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Likes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "b_articles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Likes_sub_comment_id_fkey" FOREIGN KEY ("sub_comment_id") REFERENCES "b_sub_comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "b_comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "b_users_email_key" ON "b_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "b_memos_uid_key" ON "b_memos"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "b_articles_uid_key" ON "b_articles"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "b_comments_uid_key" ON "b_comments"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "b_sub_comments_uid_key" ON "b_sub_comments"("uid");
