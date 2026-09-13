import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import pg from "pg";
import { createPostgresStateStore } from "../src/postgresStore.mjs";

const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString) {
  console.log("Postgres integration skipped (TEST_DATABASE_URL is not set).");
  process.exit(0);
}

const pool = new pg.Pool({ connectionString });
try {
  await promisify(execFile)(process.execPath, ["tools/migrate.mjs"], {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: connectionString, SFM_DB_SSL_MODE: "disable" }
  });
  const migration = await pool.query("SELECT checksum FROM sfm_schema_migrations WHERE name='001_user_state.sql'");
  assert.equal(migration.rowCount, 1);
  await pool.query("TRUNCATE sfm_idempotency_keys, sfm_user_state");
  const store = createPostgresStateStore({ pool });
  const first = await store.writeVersioned("user-a", "notifications", [{ id: 1 }], {
    expectedVersion: 0,
    idempotencyKey: "postgres-integration-0001",
    requestHash: "hash-a"
  });
  assert.equal(first.version, 1);
  const replay = await store.writeVersioned("user-a", "notifications", [{ id: 1 }], {
    expectedVersion: 0,
    idempotencyKey: "postgres-integration-0001",
    requestHash: "hash-a"
  });
  assert.equal(replay.replayed, true);
  assert.deepEqual((await store.readVersioned("user-a", "notifications", [])).value, [{ id: 1 }]);
  assert.deepEqual((await store.readVersioned("user-b", "notifications", [])).value, []);
  await assert.rejects(
    store.writeVersioned("user-a", "notifications", [], { expectedVersion: 0, idempotencyKey: "postgres-integration-0002", requestHash: "hash-b" }),
    (error) => error.statusCode === 409
  );

  const initialWrites = await Promise.allSettled([
    store.writeVersioned("race-initial", "notifications", { value: "first" }, { expectedVersion: 0 }),
    store.writeVersioned("race-initial", "notifications", { value: "second" }, { expectedVersion: 0 })
  ]);
  assert.equal(initialWrites.filter(result => result.status === "fulfilled").length, 1);
  const rejected = initialWrites.find(result => result.status === "rejected");
  assert.equal(rejected.reason.statusCode, 409);
  assert.equal((await store.readVersioned("race-initial", "notifications")).version, 1);

  const concurrentReplay = await Promise.all([
    store.writeVersioned("race-replay", "notifications", { id: 1 }, { expectedVersion: 0, idempotencyKey: "concurrent-replay-0001" }),
    store.writeVersioned("race-replay", "notifications", { id: 1 }, { expectedVersion: 0, idempotencyKey: "concurrent-replay-0001" })
  ]);
  assert.deepEqual(concurrentReplay.map(result => result.version), [1, 1]);
  assert.equal(concurrentReplay.filter(result => result.replayed).length, 1);
  console.log("Postgres integration passed, including concurrent first writes and replay.");
} finally {
  await pool.end();
}
