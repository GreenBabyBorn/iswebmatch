/*
  Warnings:

  - You are about to alter the column `fromId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT,
    "fromId" BIGINT NOT NULL,
    "username" TEXT NOT NULL
);
INSERT INTO "new_User" ("firstName", "fromId", "id", "username") SELECT "firstName", "fromId", "id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_fromId_key" ON "User"("fromId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
