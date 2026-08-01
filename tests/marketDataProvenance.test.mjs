import test from "node:test";
import assert from "node:assert/strict";
import { buildMarketDataProvenance } from "../src/marketDataProvenance.mjs";

test("market provenance exposes provider, source, timestamps and age", () => {
  const result = buildMarketDataProvenance({
    provider: "Yahoo Finance",
    symbol: "AAPL",
    marketTimestamp: 1_700_000_000,
    retrievedAt: "2023-11-14T22:15:00.000Z"
  });
  assert.equal(result.provider, "Yahoo Finance");
  assert.equal(result.symbol, "AAPL");
  assert.equal(result.sourceUrl, "https://finance.yahoo.com/");
  assert.equal(result.marketTimestamp, "2023-11-14T22:13:20.000Z");
  assert.equal(result.ageSeconds, 100);
  assert.equal(result.freshness, "current");
});

test("market provenance never invents a timestamp", () => {
  const result = buildMarketDataProvenance({ provider: "Unknown", symbol: "X", stale: true });
  assert.equal(result.marketTimestamp, null);
  assert.equal(result.ageSeconds, null);
  assert.equal(result.freshness, "stale");
  assert.equal(result.sourceUrl, null);
});
