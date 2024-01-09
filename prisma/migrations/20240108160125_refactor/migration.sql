/*
  Warnings:

  - You are about to drop the column `userTelegramId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `userTelegramId` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Match` table. All the data in the column will be lost.
  - Added the required column `platformId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "media" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "sex" INTEGER NOT NULL,
    "interest" INTEGER NOT NULL,
    "platformId" BIGINT NOT NULL,
    "platformName" TEXT NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("age", "city", "description", "id", "interest", "media", "name", "published", "sex") SELECT "age", "city", "description", "id", "interest", "media", "name", "published", "sex" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_platformId_key" ON "Profile"("platformId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT,
    "username" TEXT NOT NULL
);
INSERT INTO "new_User" ("firstName", "id", "username") SELECT "firstName", "id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_Match" (
    "fromId" BIGINT NOT NULL,
    "toId" BIGINT NOT NULL,
    CONSTRAINT "Match_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Profile" ("platformId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Profile" ("platformId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("fromId", "toId") SELECT "fromId", "toId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE UNIQUE INDEX "Match_fromId_toId_key" ON "Match"("fromId", "toId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
