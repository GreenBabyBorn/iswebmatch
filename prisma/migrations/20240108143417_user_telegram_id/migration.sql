/*
  Warnings:

  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `fromId` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `fromId` on the `Match` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `toId` on the `Match` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - Added the required column `userTelegramId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userTelegramId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "media" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "sex" INTEGER NOT NULL,
    "interest" INTEGER NOT NULL,
    "userTelegramId" BIGINT NOT NULL,
    CONSTRAINT "Profile_userTelegramId_fkey" FOREIGN KEY ("userTelegramId") REFERENCES "User" ("userTelegramId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("age", "city", "description", "id", "interest", "media", "name", "published", "sex") SELECT "age", "city", "description", "id", "interest", "media", "name", "published", "sex" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userTelegramId_key" ON "Profile"("userTelegramId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT,
    "userTelegramId" BIGINT NOT NULL,
    "username" TEXT NOT NULL
);
INSERT INTO "new_User" ("firstName", "id", "username") SELECT "firstName", "id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_userTelegramId_key" ON "User"("userTelegramId");
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromId" BIGINT NOT NULL,
    "toId" BIGINT NOT NULL,
    CONSTRAINT "Match_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Profile" ("userTelegramId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Profile" ("userTelegramId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("fromId", "id", "toId") SELECT "fromId", "id", "toId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE UNIQUE INDEX "Match_fromId_key" ON "Match"("fromId");
CREATE UNIQUE INDEX "Match_toId_key" ON "Match"("toId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
