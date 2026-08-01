import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Arabic shell starts RTL and exposes a semantic connection state", async () => {
  const html = await read("public/index.html");
  assert.match(html, /<html[^>]+lang="ar"[^>]+dir="rtl"/);
  assert.match(html, /id="connection-status"[^>]+role="status"[^>]+aria-live="polite"[^>]+data-connection-state="updating"/);
});

test("runtime language switching updates both language and direction", async () => {
  const app = await read("public/app.js");
  assert.match(app, /document\.documentElement\.lang\s*=\s*language/);
  assert.match(app, /document\.documentElement\.dir\s*=\s*getAppDirection\(language\)/);
});

test("connection states distinguish fresh, updating, stale and offline", async () => {
  const app = await read("public/app.js");
  for (const state of ["fresh", "updating", "stale", "offline"]) {
    assert.match(app, new RegExp(`"${state}"`));
  }
});
