import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

function run(env = {}) {
  return spawnSync(process.execPath, ["tools/production-preflight.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, DATABASE_URL: "", SFM_AUTH_TOKENS: "", SFM_ALLOWED_ORIGINS: "", SFM_OPERATOR_NAME: "", SFM_LEGAL_CONTACT: "", ...env }
  });
}

test("production preflight rejects missing and unsafe configuration", () => {
  assert.notEqual(run().status, 0);
  assert.notEqual(run({ DATABASE_URL: "postgres://db", SFM_AUTH_TOKENS: '{"123456789012345678901234":"user"}', SFM_ALLOWED_ORIGINS: "http://example.test" }).status, 0);
});

test("production preflight accepts isolated PostgreSQL and HTTPS configuration", () => {
  const result = run({
    DATABASE_URL: "postgres://db",
    SFM_STORAGE_DRIVER: "postgres",
    SFM_AUTH_TOKENS: '{"123456789012345678901234":"user"}',
    SFM_ALLOWED_ORIGINS: "https://trader.example.test",
    SFM_OPERATOR_NAME: "SFM Operator",
    SFM_LEGAL_CONTACT: "mailto:legal@example.test"
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).ok, true);
});
