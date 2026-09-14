import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("UI does not claim an unavailable paid membership or upgrade", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  for (const claim of ["Premium Member", "Upgrade Now", "Unlock full power"]) assert.doesNotMatch(html, new RegExp(claim, "i"));
  assert.match(html, /لا توجد باقة مدفوعة أو ترقية مفعلة/);
});

test("web vital telemetry forwards the session credential in production", async () => {
  const source = await readFile(new URL("../public/modules/webVitals.js", import.meta.url), "utf8");
  assert.match(source, /getApiToken\(\)/);
  assert.match(source, /headers\.set\("authorization", `Bearer \$\{token\}`\)/);
});

test("static market metadata never acts as a current Sharia verification", async () => {
  const source = await readFile(new URL("../src/markets.mjs", import.meta.url), "utf8");
  assert.match(source, /const LOCAL_SHARIA_UNVERIFIED/);
  assert.match(source, /shariaStatus:\s*"unknown"/);
  assert.match(source, /shariaCheckedAt:\s*"unverified"/);
  assert.doesNotMatch(source, /const COMPLIANT = \{\s*shariaStatus:\s*"compliant"/);
  assert.doesNotMatch(source, /const NOT_COMPLIANT = \{\s*shariaStatus:\s*"not_compliant"/);
});
