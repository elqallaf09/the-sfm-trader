import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("detail page reuses the lifecycle-safe market background", async () => {
  const source = await readFile(new URL("../public/detail.js", import.meta.url), "utf8");
  assert.match(source, /import \{ initMarketBackground \} from "\.\/modules\/marketBackground\.js"/);
  assert.doesNotMatch(source, /function initMarketBackground\(/);
});

test("detail requests bound symbols and cancel slow navigation", async () => {
  const source = await readFile(new URL("../public/detail.js", import.meta.url), "utf8");
  assert.match(source, /\.slice\(0, 18\)/);
  assert.match(source, /window\.setTimeout\(\(\) => controller\.abort\(\), 15_000\)/);
  assert.match(source, /window\.addEventListener\("pagehide", \(\) => detailRequestController\?\.abort\(\)/);
  assert.match(source, /content-type/);
  assert.match(source, /Math\.min\(2, window\.devicePixelRatio \|\| 1\)/);
  assert.match(source, /function formatDateTime\(value\)/);
  assert.match(source, /formatDateTime\(item\.dataProvenance\.marketTimestamp\)/);
});
