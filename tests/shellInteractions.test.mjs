import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("notification route opens a modal without replacing the underlying view", async () => {
  const source = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(source, /if \(view === "alerts"\)/);
  assert.match(source, /sfmNotificationReturn/);
  const ui = await readFile(new URL("../public/modules/uiState.js", import.meta.url), "utf8");
  assert.doesNotMatch(ui, /shellInteractions/);
});

test("mobile notification action keeps a stable touch target and contained badge", async () => {
  const source = await readFile(new URL("../public/modules/shellInteractions.js", import.meta.url), "utf8");
  assert.match(source, /max-width: 760px/);
  assert.match(source, /width: 44px !important/);
  assert.match(source, /height: 18px !important/);
  assert.match(source, /prefers-reduced-motion: reduce/);
});
