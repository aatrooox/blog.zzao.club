/*
  Warnings:

  - You are about to drop the `Likes` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `uid` on table `b_sub_comments` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `uid` to the `b_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Likes";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "b_likes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "target" TEXT NOT NULL DEFAULT 'article',
    "memo_id" INTEGER,
    "article_id" INTEGER,
    "sub_comment_id" INTEGER,
    "comment_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_likes_memo_id_fkey" FOREIGN KEY ("memo_id") REFERENCES "b_memos" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "b_likes_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "b_articles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "b_likes_sub_comment_id_fkey" FOREIGN KEY ("sub_comment_id") REFERENCES "b_sub_comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "b_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "b_comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "b_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_b_articles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_b_articles" ("create_ts", "id", "tags", "title", "uid", "updated_ts", "user_id") SELECT "create_ts", "id", "tags", "title", "uid", "updated_ts", "user_id" FROM "b_articles";
DROP TABLE "b_articles";
ALTER TABLE "new_b_articles" RENAME TO "b_articles";
CREATE UNIQUE INDEX "b_articles_uid_key" ON "b_articles"("uid");
CREATE TABLE "new_b_comments" (
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
    CONSTRAINT "b_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_b_comments" ("article_id", "content", "create_ts", "id", "memo_id", "type", "uid", "updated_ts", "user_id") SELECT "article_id", "content", "create_ts", "id", "memo_id", "type", "uid", "updated_ts", "user_id" FROM "b_comments";
DROP TABLE "b_comments";
ALTER TABLE "new_b_comments" RENAME TO "b_comments";
CREATE UNIQUE INDEX "b_comments_uid_key" ON "b_comments"("uid");
CREATE TABLE "new_b_memos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "nickname" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_memos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_b_memos" ("content", "create_ts", "id", "nickname", "tags", "uid", "updated_ts", "user_id") SELECT "content", "create_ts", "id", "nickname", "tags", "uid", "updated_ts", "user_id" FROM "b_memos";
DROP TABLE "b_memos";
ALTER TABLE "new_b_memos" RENAME TO "b_memos";
CREATE UNIQUE INDEX "b_memos_uid_key" ON "b_memos"("uid");
CREATE TABLE "new_b_sub_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "reply_sub_comment_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "memo_id" INTEGER,
    CONSTRAINT "b_sub_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "b_comments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "b_sub_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_b_sub_comments" ("comment_id", "content", "create_ts", "id", "memo_id", "reply_sub_comment_id", "uid", "updated_ts", "user_id") SELECT "comment_id", "content", "create_ts", "id", "memo_id", "reply_sub_comment_id", "uid", "updated_ts", "user_id" FROM "b_sub_comments";
DROP TABLE "b_sub_comments";
ALTER TABLE "new_b_sub_comments" RENAME TO "b_sub_comments";
CREATE UNIQUE INDEX "b_sub_comments_uid_key" ON "b_sub_comments"("uid");
CREATE TABLE "new_b_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "nickname" TEXT,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_b_users" ("avatar_url", "email", "id", "nickname", "password", "role", "username") SELECT "avatar_url", "email", "id", "nickname", "password", "role", "username" FROM "b_users";
DROP TABLE "b_users";
ALTER TABLE "new_b_users" RENAME TO "b_users";
CREATE UNIQUE INDEX "b_users_uid_key" ON "b_users"("uid");
CREATE UNIQUE INDEX "b_users_email_key" ON "b_users"("email");
CREATE UNIQUE INDEX "b_users_username_key" ON "b_users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
