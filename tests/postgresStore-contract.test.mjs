import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/postgresStore.mjs", import.meta.url), "utf8");

test("expired idempotency keys are removed before replay lookup", () => {
  const deletion = source.indexOf("DELETE FROM sfm_idempotency_keys");
  const replayLookup = source.indexOf("SELECT request_hash, state_version, response_payload");
  assert.ok(deletion >= 0, "expired-key cleanup is required");
  assert.ok(replayLookup > deletion, "cleanup must happen before replay lookup");
  assert.match(source.slice(deletion, replayLookup), /user_id=\$1 AND namespace=\$2 AND expires_at <= now\(\)/);
});
