import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { createHomeDashboard } from "../public/modules/homeDashboard.js";
import { calculateFinalScore, getAnalysisMetrics } from "../public/modules/analysisMetrics.js";

test("Home initializes and renders provider analysis without relying on app globals", context => {
  const dom = new JSDOM('<section id="terminal-home-v3"><span id="v3-confidence"></span><div id="v3-opportunity-grid"></div><div id="v3-heatmap-grid"></div><div id="v3-pulse-chart"></div><div id="v3-followed-list"></div><div id="v3-calendar-list"></div></section>');
  const original = globalThis.document;
  globalThis.document = dom.window.document;
  context.after(() => { globalThis.document = original; dom.window.close(); });
  const dashboard = createHomeDashboard({
    calculateFinalScore, clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
    localizeUiText: String, formatNumber: String, formatPercent: value => String(value) + "%",
    formatDateTime: String, formatMoney: value => String(value), getMarketPulse: () => "pulse",
    attachDetailOpeners() {}, isEnglishLanguage: () => false, getFollowedEntries: () => [], reload() {}
  });
  assert.doesNotThrow(() => dashboard.setState("loading"));
  const item = { symbol: "AAPL", name: "Apple", action: "buy", actionLabel: "شراء", currency: "USD", currentPrice: 100, target1: 110, expectedMovePct: 10, confidence: 76, duration: "3 إلى 10 أيام" };
  assert.doesNotThrow(() => dashboard.render({ recommendations: [item], economicCalendar: { upcoming: [{ title: "Test <event>", currency: "USD", isoTime: "2026-09-15T12:00:00Z", impact: "high", localTimeLabel: "15:00" }] } }));
  const card = document.querySelector(".v3-opportunity-card");
  assert.match(card.textContent, /110/);
  assert.match(card.textContent, /76%/);
  assert.match(card.textContent, /3 إلى 10 أيام/);
  assert.match(card.textContent, /\d+ \/ 100/);
  assert.equal(document.querySelector("#v3-calendar-list event"), null);
  assert.match(document.querySelector("#v3-calendar-list").textContent, /Test <event>/);
  dashboard.render({ recommendations: [{ symbol: "AAPL", currentPrice: 100 }] });
  assert.match(document.querySelector(".v3-opportunity-card").textContent, /غير متاح/);
  assert.equal(document.querySelector("#v3-confidence").textContent, "--");
});

test("analysis targets use valid provider values and preserve missing states", () => {
  assert.equal(getAnalysisMetrics({ target1: null, expectedPrice: 112 }).target, 112);
  assert.equal(getAnalysisMetrics({ tradePlan: { target1: 115 } }).target, 115);
  assert.equal(getAnalysisMetrics({ target1: "", expectedPrice: null }).target, null);
  assert.equal(getAnalysisMetrics({ confidence: 0 }).confidenceText, "0%");
  assert.equal(getAnalysisMetrics({}).score, null);
});
