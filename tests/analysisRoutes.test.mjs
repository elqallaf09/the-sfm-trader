import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { finalizeRecommendation } from "../src/recommendationPolicy.mjs";
import { applyEconomicNewsOverlayToRecommendations } from "../src/economicCalendar.mjs";

const source = await readFile(new URL("../server.mjs", import.meta.url), "utf8");
function declaration(name) {
  const start = source.search(new RegExp("^(?:async )?function " + name + "\\(", "m"));
  assert.ok(start >= 0);
  const rest = source.slice(start);
  const next = rest.slice(1).search(/\n(?:async )?function \w+\(/);
  return next < 0 ? rest : rest.slice(0, next + 1);
}
test("cached market, watchlist and detail responses apply the same closed-session restriction", async () => {
  const item = { symbol: "AAPL", action: "buy", confidence: 80, decision: { kind: "buy", message: "Buy now" } };
  const payload = { recommendations: [item], market: { id: "us" } };
  const entries = new Map([
    ["market:us", { createdAt: Date.now(), payload }],
    ["watchlist:AAPL", { createdAt: Date.now(), payload }],
    ["asset:AAPL", { createdAt: Date.now(), payload: { recommendation: item, asset: {}, market: { id: "us" } } }]
  ]);
  let calendars = 0;
  const context = vm.createContext({
    cache: entries, CACHE_TTL_MS: 90000, STALE_CACHE_TTL_MS: 600000, markets: { us: { symbols: [] } },
    sendJson: (_response, value) => value,
    getExecutionSessionState: () => ({ isOpen: false }),
    isAggregateMarket: id => id === "watchlist",
    resolveSymbolExecutionMarketId: () => "us",
    resolveCurrencyForAsset: () => "USD",
    buildOpportunityRadar: () => ({}), buildSmartAlerts: () => [], buildBacktestSummary: () => ({}),
    finalizeRecommendation, applyEconomicNewsOverlayToRecommendations,
    getEconomicCalendarForMarket: async () => { calendars++; return { dataState: "unavailable" }; }
  });
  vm.runInContext([
    "handleRecommendations", "handleWatchlist", "getAssetDetailPayload",
    "finalizeRecommendationsPayloadForSession", "finalizeRecommendationForExecutionSession", "normalizeRecommendationCurrency"
  ].map(declaration).join("\n"), context);
  const market = await context.handleRecommendations({}, "us");
  const watchlist = await context.handleWatchlist({}, ["AAPL"]);
  const detail = await context.getAssetDetailPayload("AAPL");
  for (const result of [market.recommendations[0], watchlist.recommendations[0], detail.recommendation]) {
    assert.equal(result.action, "hold");
    assert.equal(result.decision.kind, "hold");
    assert.equal(result.marketClosed, true);
  }
  assert.equal(detail.recommendation.economicNewsRisk.level, "unavailable");
  assert.equal(calendars, 1);
});
