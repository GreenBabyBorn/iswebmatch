/*
  Warnings:

  - You are about to drop the column `userFromId` on the `User` table. All the data in the column will be lost.
  - Added the required column `fromId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT,
    "fromId" INTEGER NOT NULL,
    "username" TEXT NOT NULL
);
INSERT INTO "new_User" ("firstName", "id", "username") SELECT "firstName", "id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_fromId_key" ON "User"("fromId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
