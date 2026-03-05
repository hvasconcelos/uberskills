import { existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { runMigrations } from "./migrate";
import { DEFAULT_DATABASE_URL } from "./sqlite-utils";

/**
 * Resets the database by deleting the SQLite file (and WAL/SHM journals)
 * then re-running all migrations from scratch.
 */
function resetDatabase(): void {
  const url = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL;

  if (!url.startsWith("file:")) {
    console.error(`db:reset only supports file: URLs (got "${url}").`);
    process.exit(1);
  }

  const relativePath = url.slice("file:".length);
  const absolutePath = resolve(process.cwd(), relativePath);

  // Delete the main DB file and any WAL/SHM journals
  for (const suffix of ["", "-wal", "-shm"]) {
    const file = absolutePath + suffix;
    if (existsSync(file)) {
      unlinkSync(file);
      console.log(`Deleted ${file}`);
    }
  }

  console.log("Running migrations...");
  runMigrations(url);
  console.log("Database reset complete.");
}

resetDatabase();
