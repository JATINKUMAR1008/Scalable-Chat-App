/*
  Warnings:

  - Added the required column `linkedUserId` to the `LinkedAccounts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LinkedAccounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "linkedUserId" TEXT NOT NULL,
    CONSTRAINT "LinkedAccounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LinkedAccounts" ("id", "userId") SELECT "id", "userId" FROM "LinkedAccounts";
DROP TABLE "LinkedAccounts";
ALTER TABLE "new_LinkedAccounts" RENAME TO "LinkedAccounts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
