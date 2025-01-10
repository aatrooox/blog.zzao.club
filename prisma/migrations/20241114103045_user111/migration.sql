/*
  Warnings:

  - Made the column `username` on table `b_users` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_b_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "nickname" TEXT,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_b_users" ("avatar_url", "email", "id", "nickname", "password", "role", "uid", "username") SELECT "avatar_url", "email", "id", "nickname", "password", "role", "uid", "username" FROM "b_users";
DROP TABLE "b_users";
ALTER TABLE "new_b_users" RENAME TO "b_users";
CREATE UNIQUE INDEX "b_users_uid_key" ON "b_users"("uid");
CREATE UNIQUE INDEX "b_users_email_key" ON "b_users"("email");
CREATE UNIQUE INDEX "b_users_username_key" ON "b_users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
