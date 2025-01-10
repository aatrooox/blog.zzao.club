-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "b_sub_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "b_comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "b_sub_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_b_sub_comments" ("comment_id", "content", "create_ts", "id", "memo_id", "reply_sub_comment_id", "uid", "updated_ts", "user_id") SELECT "comment_id", "content", "create_ts", "id", "memo_id", "reply_sub_comment_id", "uid", "updated_ts", "user_id" FROM "b_sub_comments";
DROP TABLE "b_sub_comments";
ALTER TABLE "new_b_sub_comments" RENAME TO "b_sub_comments";
CREATE UNIQUE INDEX "b_sub_comments_uid_key" ON "b_sub_comments"("uid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
