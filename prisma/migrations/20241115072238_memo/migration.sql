/*
  Warnings:

  - You are about to drop the column `nickname` on the `b_memos` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_b_memos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "visible" TEXT NOT NULL DEFAULT 'public',
    "defalt_floded" BOOLEAN NOT NULL DEFAULT false,
    "flod_tip" TEXT,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_memos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_b_memos" ("content", "create_ts", "id", "tags", "uid", "updated_ts", "user_id") SELECT "content", "create_ts", "id", "tags", "uid", "updated_ts", "user_id" FROM "b_memos";
DROP TABLE "b_memos";
ALTER TABLE "new_b_memos" RENAME TO "b_memos";
CREATE UNIQUE INDEX "b_memos_uid_key" ON "b_memos"("uid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
