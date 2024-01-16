-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LinkedAccounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "linkedUserId" TEXT NOT NULL,
    CONSTRAINT "LinkedAccounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LinkedAccounts_linkedUserId_fkey" FOREIGN KEY ("linkedUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LinkedAccounts" ("id", "linkedUserId", "userId") SELECT "id", "linkedUserId", "userId" FROM "LinkedAccounts";
DROP TABLE "LinkedAccounts";
ALTER TABLE "new_LinkedAccounts" RENAME TO "LinkedAccounts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
