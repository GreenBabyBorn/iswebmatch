/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

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
    "platformName" TEXT NOT NULL
);
INSERT INTO "new_Profile" ("age", "city", "description", "id", "interest", "media", "name", "platformId", "platformName", "published", "sex", "userId") SELECT "age", "city", "description", "id", "interest", "media", "name", "platformId", "platformName", "published", "sex", "userId" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_platformId_key" ON "Profile"("platformId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
