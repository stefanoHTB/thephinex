-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bulkOperationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "startedAt" TEXT NOT NULL,
    "finishedAt" TEXT,
    "url" TEXT
);
INSERT INTO "new_Job" ("bulkOperationId", "endpoint", "finishedAt", "format", "id", "startedAt", "status", "type", "url") SELECT "bulkOperationId", "endpoint", "finishedAt", "format", "id", "startedAt", "status", "type", "url" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
