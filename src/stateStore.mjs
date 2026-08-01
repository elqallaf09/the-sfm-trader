import path from "node:path";
import { createUserFileStore } from "./fileStore.mjs";
import { createPostgresStateStore } from "./postgresStore.mjs";

export function createStateStore(options = {}) {
  const driver = String(options.driver || process.env.SFM_STORAGE_DRIVER || (process.env.DATABASE_URL ? "postgres" : "file")).toLowerCase();
  if (driver === "postgres") return createPostgresStateStore(options.postgres);
  if (driver !== "file") throw new Error(`Unsupported SFM_STORAGE_DRIVER: ${driver}`);
  return createUserFileStore(options.dataDir || process.env.SFM_DATA_DIR || path.join(process.cwd(), ".data"));
}
