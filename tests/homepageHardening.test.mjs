import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";

test("homepage exposes keyboard navigation and mobile disclosure state", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  const dom = new JSDOM(html);
  const { document } = dom.window;

  assert.equal(document.querySelector(".skip-link")?.getAttribute("href"), "#main-content");
  assert.equal(document.querySelector("main")?.id, "main-content");
  assert.equal(document.querySelector("#mobile-settings-button")?.getAttribute("aria-controls"), "settings-panel");
  assert.equal(document.querySelector("#mobile-notification-button")?.getAttribute("aria-controls"), "notification-panel");
  assert.equal(document.querySelector("[data-recommendation-drawer]")?.getAttribute("role"), "dialog");
  assert.equal(document.querySelector("[data-recommendation-drawer]")?.hasAttribute("inert"), true);
  assert.equal(document.querySelector("#settings-panel")?.getAttribute("role"), "dialog");
  assert.equal(document.querySelector("#notification-panel")?.getAttribute("aria-labelledby"), "notification-title");
  dom.window.close();
});

test("homepage animation pauses for hidden and reduced-motion states", async () => {
  const source = await readFile(new URL("../public/app.js", import.meta.url), "utf8");

  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /document\.hidden/);
  assert.match(source, /cancelAnimationFrame\(animationFrame\)/);
  assert.match(source, /init\(\)\.catch\(handleBootstrapFailure\)/);
});
