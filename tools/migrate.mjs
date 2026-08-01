import crypto from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to run migrations");

const pool = new pg.Pool({
  connectionString,
  max: 1,
  ssl: String(process.env.SFM_DB_SSL_MODE || "require").toLowerCase() === "disable"
    ? false
    : { rejectUnauthorized: String(process.env.SFM_DB_SSL_MODE || "require").toLowerCase() === "verify-full" }
});
const client = await pool.connect();

try {
  await client.query("SELECT pg_advisory_lock(hashtext('the-sfm-trader:migrations'))");
  await client.query(`
    CREATE TABLE IF NOT EXISTS sfm_schema_migrations (
      name text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const migrationsDir = path.resolve("migrations");
  const files = (await readdir(migrationsDir)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of files) {
    const sql = await readFile(path.join(migrationsDir, name), "utf8");
    const checksum = crypto.createHash("sha256").update(sql).digest("hex");
    const existing = await client.query("SELECT checksum FROM sfm_schema_migrations WHERE name=$1", [name]);
    if (existing.rowCount) {
      if (existing.rows[0].checksum !== checksum) throw new Error(`Applied migration changed: ${name}`);
      console.log(`[migration unchanged] ${name}`);
      continue;
    }

    // Migration files may contain their own BEGIN/COMMIT block. The advisory
    // lock serializes deploys, and migrations must remain safe to retry.
    await client.query(sql);
    await client.query("INSERT INTO sfm_schema_migrations (name, checksum) VALUES ($1,$2)", [name, checksum]);
    console.log(`[migration applied] ${name}`);
  }
} finally {
  await client.query("SELECT pg_advisory_unlock(hashtext('the-sfm-trader:migrations'))").catch(() => {});
  client.release();
  await pool.end();
}
