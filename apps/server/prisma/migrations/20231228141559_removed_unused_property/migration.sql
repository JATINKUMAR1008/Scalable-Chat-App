/*
  Warnings:

  - You are about to drop the column `roomId` on the `groupRoom` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_groupRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_groupRoom" ("id", "name") SELECT "id", "name" FROM "groupRoom";
DROP TABLE "groupRoom";
ALTER TABLE "new_groupRoom" RENAME TO "groupRoom";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
