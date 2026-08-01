import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { renderUiState, setUiState } from "../public/modules/uiState.js";

test("UI states are semantic, escaped and language-neutral", () => {
  const html = renderUiState({ kind: "error", title: "تعذر", message: '<script>alert(1)</script>', actionLabel: "إعادة", actionId: "retry" });
  assert.match(html, /role="alert"/);
  assert.match(html, /data-ui-state="error"/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /data-ui-state-action="retry"/);
});

test("setUiState replaces stale content and exposes loading busy state", () => {
  const dom = new JSDOM('<div id="target">old</div>');
  const target = dom.window.document.querySelector("#target");
  setUiState(target, { kind: "loading", message: "Loading" });
  assert.equal(target.querySelector("[aria-busy=true]")?.dataset.uiState, "loading");
  assert.doesNotMatch(target.textContent, /old/);
});
