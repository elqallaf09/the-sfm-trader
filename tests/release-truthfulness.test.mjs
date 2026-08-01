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
  assert.match(source, /API_TOKEN_STORAGE_KEY/);
  assert.match(source, /headers\.set\("authorization", `Bearer \$\{token\}`\)/);
});
