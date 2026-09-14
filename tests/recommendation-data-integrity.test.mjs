import test from "node:test";
import assert from "node:assert/strict";
import { finalizeRecommendation, resolveTrustedCurrency } from "../src/recommendationPolicy.mjs";

const openSession = {
  isOpen: true,
  label: "نيويورك",
  timeZone: "America/New_York"
};

test("mixed-market currencies do not fall back to EUR or USD incorrectly", () => {
  assert.equal(resolveTrustedCurrency("NESN.SW", "EUR", "EUR"), "CHF");
  assert.equal(resolveTrustedCurrency("AZN.L", "EUR", "EUR"), "GBX");
  assert.equal(resolveTrustedCurrency("005930.KS", "USD", "MIXED"), "KRW");
  assert.equal(resolveTrustedCurrency("9988.HK", "USD", "MIXED"), "HKD");
  assert.equal(resolveTrustedCurrency("7203.T", "USD", "MIXED"), "JPY");
});

test("open market buy signal is blocked when the market timestamp is stale", () => {
  const originalNow = Date.now;
  Date.now = () => Date.parse("2026-09-14T14:00:00.000Z");
  try {
    const result = finalizeRecommendation({
      symbol: "AAPL",
      currency: "USD",
      action: "buy",
      actionLabel: "شراء",
      confidence: 88,
      reasons: ["اختبار"],
      dataProvenance: {
        freshness: "current",
        marketTimestamp: "2026-09-14T12:30:00.000Z"
      },
      dataHealth: { staleFrames: [] },
      decision: { kind: "buy", badge: "اشتر", title: "فرصة" }
    }, { currency: "USD", executionMarketId: "us", session: openSession });

    assert.equal(result.action, "hold");
    assert.equal(result.stalePriceBlocked, true);
    assert.equal(result.priceFreshness.state, "stale");
    assert.ok(result.confidence <= 58);
  } finally {
    Date.now = originalNow;
  }
});

test("open market signal is blocked when market timestamp is missing", () => {
  const result = finalizeRecommendation({
    symbol: "MSFT",
    currency: "USD",
    action: "sell",
    actionLabel: "بيع",
    confidence: 79,
    reasons: [],
    dataProvenance: { freshness: "unknown", marketTimestamp: null },
    dataHealth: { staleFrames: [] }
  }, { currency: "USD", executionMarketId: "us", session: openSession });

  assert.equal(result.action, "hold");
  assert.equal(result.stalePriceBlocked, true);
  assert.equal(result.priceFreshness.state, "unknown");
});

test("fresh open-market price keeps the actionable signal", () => {
  const originalNow = Date.now;
  Date.now = () => Date.parse("2026-09-14T14:00:00.000Z");
  try {
    const result = finalizeRecommendation({
      symbol: "NVDA",
      currency: "USD",
      action: "buy",
      actionLabel: "شراء",
      confidence: 82,
      reasons: [],
      dataProvenance: {
        freshness: "current",
        marketTimestamp: "2026-09-14T13:45:00.000Z"
      },
      dataHealth: { staleFrames: [] }
    }, { currency: "USD", executionMarketId: "us", session: openSession });

    assert.equal(result.action, "buy");
    assert.equal(result.stalePriceBlocked, undefined);
    assert.equal(result.priceFreshness.state, "current");
  } finally {
    Date.now = originalNow;
  }
});
