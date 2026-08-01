import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import axe from "axe-core";
import { JSDOM } from "jsdom";

for (const page of ["index.html", "detail.html", "privacy.html", "terms.html", "risk-disclosure.html"]) {
  test(`${page} has no critical static accessibility violations`, async () => {
    const html = (await readFile(new URL(`../public/${page}`, import.meta.url), "utf8"))
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<script\b[^>]*\/>/gi, "");
    const dom = new JSDOM(html, { runScripts: "dangerously", url: `https://example.test/${page}` });
    dom.window.eval(axe.source);
    const results = await dom.window.axe.run(dom.window.document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      rules: { "color-contrast": { enabled: false } }
    });
    const serious = results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact));
    assert.equal(serious.length, 0, JSON.stringify(serious.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length }))));
    dom.window.close();
  });
}
