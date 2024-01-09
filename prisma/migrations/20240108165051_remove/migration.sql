/*
  Warnings:

  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.

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
    "platformId" BIGINT NOT NULL,
    "platformName" TEXT NOT NULL
);
INSERT INTO "new_Profile" ("age", "city", "description", "id", "interest", "media", "name", "platformId", "platformName", "published", "sex") SELECT "age", "city", "description", "id", "interest", "media", "name", "platformId", "platformName", "published", "sex" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_platformId_key" ON "Profile"("platformId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
