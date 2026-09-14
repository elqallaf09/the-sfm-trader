import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const source = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
function declaration(name) {
  const start = source.indexOf("function " + name + "(");
  assert.ok(start >= 0);
  const end = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, end < 0 ? undefined : end);
}
test("late education sections obey the current route before insertion", () => {
  for (const view of ["home", "education"]) {
    const dom = new JSDOM('<main><section id="voice-section"></section></main>');
    const context = vm.createContext({
      document: dom.window.document,
      activeAppView: view,
      sfmAcceptanceIsEnglish: () => false
    });
    const groups = source.match(/const APP_VIEW_GROUPS = \{[\s\S]*?\n\};/)?.[0];
    assert.ok(groups);
    vm.runInContext([groups, declaration("syncAppSectionVisibility"), declaration("ensureEducationSection")].join("\n"), context);
    context.ensureEducationSection();
    const section = dom.window.document.querySelector("#education-section");
    assert.equal(section.hidden, view !== "education");
    assert.equal(section.style.display, view === "education" ? "" : "none");
    context.syncAppSectionVisibility(section, "education");
    assert.equal(section.hidden, false);
    assert.equal(section.style.display, "");
    context.syncAppSectionVisibility(section, "home");
    assert.equal(section.style.getPropertyPriority("display"), "important");
    assert.equal(section.hidden, true);
    context.ensureEducationSection();
    assert.equal(dom.window.document.querySelectorAll("#education-section").length, 1);
    dom.window.close();
  }
});
