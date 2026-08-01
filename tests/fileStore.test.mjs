import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
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
  assert.deepEqual(JSON.parse(await readFile(path.join(root, "user-a", "notifications.json"), "utf8")), { value: "a" });
});

test("file store rejects path traversal", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "sfm-store-"));
  const store = createUserFileStore(root);
  await assert.rejects(store.write("../escape", "notifications", {}), /Invalid user ID/);
});
