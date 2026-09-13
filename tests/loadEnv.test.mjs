import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadEnvFile } from "../src/loadEnv.mjs";

test("environment loader preserves injected values and supports trimmed and quoted settings", async context => {
  const directory = await mkdtemp(path.join(tmpdir(), "sfm-env-test-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const file = path.join(directory, ".env");
  await writeFile(file, 'PROVIDER_REQUEST_TIMEOUT_MS = 1234\nEXISTING=replace\nexport QUOTED="a=b # literal"\nPLAIN=value # note\nEMPTY=replaced\n');
  const environment = { EXISTING: "keep", EMPTY: "" };
  loadEnvFile(file, environment);
  assert.equal(environment.PROVIDER_REQUEST_TIMEOUT_MS, "1234");
  assert.equal(environment.EXISTING, "keep");
  assert.equal(environment.EMPTY, "");
  assert.equal(environment.QUOTED, "a=b # literal");
  assert.equal(environment.PLAIN, "value");
});
