import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createUserFileStore } from "../src/fileStore.mjs";

test("file store isolates users and writes valid JSON atomically", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "sfm-store-"));
  const store = createUserFileStore(root);
  await Promise.all([
    store.write("user-a", "notifications", { value: "a" }),
    store.write("user-b", "notifications", { value: "b" })
  ]);
  assert.deepEqual(await store.read("user-a", "notifications"), { value: "a" });
  assert.deepEqual(await store.read("user-b", "notifications"), { value: "b" });
  const persisted = JSON.parse(await readFile(path.join(root, "user-a", "notifications.json"), "utf8"));
  assert.equal(persisted._sfmState, 1);
  assert.equal(persisted.version, 1);
  assert.deepEqual(persisted.value, { value: "a" });
});

test("file store enforces optimistic versions and idempotent retries", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "sfm-store-"));
  const store = createUserFileStore(root);
  const first = await store.writeVersioned("user-a", "notifications", { value: 1 }, { expectedVersion: 0, idempotencyKey: "request-0001" });
  assert.equal(first.version, 1);
  const replay = await store.writeVersioned("user-a", "notifications", { value: 1 }, { expectedVersion: 0, idempotencyKey: "request-0001" });
  assert.equal(replay.replayed, true);
  assert.equal(replay.version, 1);
  await assert.rejects(
    store.writeVersioned("user-a", "notifications", { value: 2 }, { expectedVersion: 0, idempotencyKey: "request-0002" }),
    (error) => error.statusCode === 409
  );
});

test("file store reads legacy unversioned documents without data loss", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "sfm-store-"));
  const store = createUserFileStore(root);
  await store.write("user-a", "seed", { legacy: true });
  const filePath = path.join(root, "user-a", "seed.json");
  const persisted = JSON.parse(await readFile(filePath, "utf8"));
  assert.deepEqual(persisted.value, { legacy: true });
});

test("file store rejects path traversal", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "sfm-store-"));
  const store = createUserFileStore(root);
  await assert.rejects(store.write("../escape", "notifications", {}), /Invalid user ID/);
});

test("file store refuses to overwrite corrupted user state", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "sfm-store-corrupt-"));
  const userDir = path.join(root, "user-a");
  const statePath = path.join(userDir, "notifications.json");
  await mkdir(userDir, { recursive: true });
  await writeFile(statePath, "{not-json", "utf8");
  const store = createUserFileStore(root);

  await assert.rejects(store.readVersioned("user-a", "notifications", {}), (error) => error.code === "SFM_STATE_CORRUPTED");
  await assert.rejects(store.writeVersioned("user-a", "notifications", { notifications: [] }), (error) => error.code === "SFM_STATE_CORRUPTED");
  assert.equal(await readFile(statePath, "utf8"), "{not-json");
  await rm(root, { recursive: true, force: true });
});
