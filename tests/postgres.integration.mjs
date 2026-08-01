import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import pg from "pg";
import { createPostgresStateStore } from "../src/postgresStore.mjs";

const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString) {
  console.log("Postgres integration skipped (TEST_DATABASE_URL is not set).");
  process.exit(0);
}

const pool = new pg.Pool({ connectionString });
try {
  await pool.query(await readFile(new URL("../migrations/001_user_state.sql", import.meta.url), "utf8"));
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
  console.log("Postgres integration passed.");
} finally {
  await pool.end();
}
