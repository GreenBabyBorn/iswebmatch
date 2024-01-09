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
    "platformId" TEXT NOT NULL,
    "platformName" TEXT NOT NULL
);
INSERT INTO "new_Profile" ("age", "city", "description", "id", "interest", "media", "name", "platformId", "platformName", "published", "sex") SELECT "age", "city", "description", "id", "interest", "media", "name", "platformId", "platformName", "published", "sex" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_platformId_key" ON "Profile"("platformId");
CREATE TABLE "new_Match" (
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    CONSTRAINT "Match_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Profile" ("platformId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Profile" ("platformId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("fromId", "toId") SELECT "fromId", "toId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE UNIQUE INDEX "Match_fromId_toId_key" ON "Match"("fromId", "toId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
