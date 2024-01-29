/*
  Warnings:

  - You are about to drop the column `bulkOperationId` on the `Job` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "startedAt" TEXT NOT NULL,
    "finishedAt" TEXT,
    "url" TEXT
);
INSERT INTO "new_Job" ("endpoint", "finishedAt", "format", "id", "startedAt", "status", "type", "url") SELECT "endpoint", "finishedAt", "format", "id", "startedAt", "status", "type", "url" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
