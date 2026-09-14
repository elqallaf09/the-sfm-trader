import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("alerts rail opens the actual notification panel instead of routing to unrelated sections", async () => {
  const source = await readFile(new URL("../public/modules/shellInteractions.js", import.meta.url), "utf8");
  assert.match(source, /data-nav-key=\\?"alerts\\?"/);
  assert.match(source, /#notification-button, #mobile-notification-button/);
  assert.match(source, /stopImmediatePropagation/);
  assert.match(source, /#notification-panel/);
});

test("mobile notification action keeps a stable touch target and contained badge", async () => {
  const source = await readFile(new URL("../public/modules/shellInteractions.js", import.meta.url), "utf8");
  assert.match(source, /max-width: 760px/);
  assert.match(source, /width: 44px !important/);
  assert.match(source, /height: 18px !important/);
  assert.match(source, /prefers-reduced-motion: reduce/);
});
