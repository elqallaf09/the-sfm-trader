import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("dashboard loads one final authoritative layout after legacy theme sheets", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((match) => match[1]);
  const stableIndex = styles.findIndex((value) => value.includes("layout-stability.css"));
  assert.ok(stableIndex > styles.findIndex((value) => value.includes("cinema.css")));
  assert.ok(stableIndex > styles.findIndex((value) => value.includes("styles.css")));
});

test("desktop dashboard keeps rail, main, summary and footer in named grid areas", async () => {
  const css = await readFile(new URL("../public/layout-stability.css", import.meta.url), "utf8");
  assert.match(css, /"rail main right"/);
  assert.match(css, /grid-area: rail !important/);
  assert.match(css, /grid-area: main !important/);
  assert.match(css, /grid-area: right !important/);
  assert.match(css, /grid-area: footer !important/);
  assert.match(css, /grid-template-rows: auto 0 minmax\(0, auto\) auto !important/);
  assert.match(css, /flex: 0 0 var\(--stable-rail\) !important/);
  assert.match(css, /position: absolute !important/);
  assert.match(css, /@media \(min-width: 1024px\) and \(max-width: 1439px\)/);
  assert.match(css, /"rail main"\s*\n\s*"rail right"/);
  assert.match(css, /@media \(max-width: 1023px\)/);
  assert.match(css, /\.site-footer \{\s*display: flex !important/);
  assert.match(css, /padding-bottom: 12px !important/);
});

test("offline shell includes the authoritative layout stylesheet", async () => {
  const worker = await readFile(new URL("../public/service-worker.js", import.meta.url), "utf8");
  assert.match(worker, /layout-stability\.css\?v=20260802-dashboard-grid/);
});
