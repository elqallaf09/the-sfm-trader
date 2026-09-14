import test from "node:test";
import assert from "node:assert/strict";
import { finalizeRecommendation, getFastPriceFreshness, resolveTrustedCurrency } from "../src/recommendationPolicy.mjs";

const openSession = {
  isOpen: true,
  label: "نيويورك",
  timeZone: "America/New_York"
};
const closedSession = {
  isOpen: false,
  label: "نيويورك",
  timeZone: "America/New_York",
  openAt: "2026-09-15T13:30:00.000Z"
};

const frame = (id, iso, label = id) => ({ id, label, latestTimestamp: Date.parse(iso) / 1000 });

test("mixed-market currencies do not fall back to EUR or USD incorrectly", () => {
  assert.equal(resolveTrustedCurrency("NESN.SW", "EUR", "EUR"), "CHF");
  assert.equal(resolveTrustedCurrency("AZN.L", "GBp", "EUR"), "GBX");
  assert.equal(resolveTrustedCurrency("AZN.L", "GBP", "EUR"), "GBP");
  assert.equal(resolveTrustedCurrency("005930.KS", "USD", "MIXED"), "KRW");
  assert.equal(resolveTrustedCurrency("9988.HK", "USD", "MIXED"), "HKD");
  assert.equal(resolveTrustedCurrency("7203.T", "USD", "MIXED"), "JPY");
});

test("freshness selects a current fast frame instead of aging the daily frame", () => {
  const now = Date.parse("2026-09-14T14:00:00.000Z");
  const freshness = getFastPriceFreshness({
    timeframes: [
      frame("1d", "2026-09-14T00:00:00.000Z", "يومي"),
      frame("15m", "2026-09-14T13:45:00.000Z", "15 دقيقة"),
      frame("1h", "2026-09-14T13:00:00.000Z", "ساعة")
    ]
  }, now);
  assert.equal(freshness.state, "current");
  assert.equal(freshness.frame, "15m");
  assert.equal(freshness.ageSeconds, 900);
});

test("open market buy signal is blocked when every fast frame is stale", () => {
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
        marketTimestamp: "2026-09-14T00:00:00.000Z",
        retrievedAt: "2026-09-14T14:00:00.000Z"
      },
      timeframes: [
        frame("15m", "2026-09-14T12:30:00.000Z", "15 دقيقة"),
        frame("1h", "2026-09-14T10:00:00.000Z", "ساعة")
      ],
      decision: { kind: "buy", badge: "اشتر", title: "فرصة" }
    }, { currency: "USD", executionMarketId: "us", session: openSession });

    assert.equal(result.action, "hold");
    assert.equal(result.stalePriceBlocked, true);
    assert.equal(result.priceFreshness.state, "stale");
    assert.equal(result.priceFreshness.retrievedAt, "2026-09-14T14:00:00.000Z");
    assert.equal(result.priceFreshness.primaryMarketTimestamp, "2026-09-14T00:00:00.000Z");
    assert.ok(result.confidence <= 58);
  } finally {
    Date.now = originalNow;
  }
});

test("open market signal is blocked when no fast timeframe timestamp exists", () => {
  const result = finalizeRecommendation({
    symbol: "MSFT",
    currency: "USD",
    action: "sell",
    actionLabel: "بيع",
    confidence: 79,
    reasons: [],
    dataProvenance: { freshness: "current", marketTimestamp: "2026-09-14T00:00:00.000Z" },
    timeframes: [{ id: "1d", label: "يومي", latestTimestamp: Date.parse("2026-09-14T00:00:00.000Z") / 1000 }]
  }, { currency: "USD", executionMarketId: "us", session: openSession });

  assert.equal(result.action, "hold");
  assert.equal(result.stalePriceBlocked, true);
  assert.equal(result.priceFreshness.state, "unknown");
  assert.equal(result.priceFreshness.reason, "fast-frame-missing");
});

test("fresh intraday frame keeps an actionable open-market signal even when daily timestamp is old", () => {
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
        marketTimestamp: "2026-09-14T00:00:00.000Z",
        retrievedAt: "2026-09-14T14:00:00.000Z"
      },
      timeframes: [
        frame("15m", "2026-09-14T13:45:00.000Z", "15 دقيقة"),
        frame("1d", "2026-09-14T00:00:00.000Z", "يومي")
      ]
    }, { currency: "USD", executionMarketId: "us", session: openSession });

    assert.equal(result.action, "buy");
    assert.equal(result.stalePriceBlocked, undefined);
    assert.equal(result.priceFreshness.state, "current");
    assert.equal(result.priceFreshness.frame, "15m");
  } finally {
    Date.now = originalNow;
  }
});

test("closed market and holiday-like closed sessions do not raise false stale alarms", () => {
  const result = finalizeRecommendation({
    symbol: "AAPL",
    currency: "USD",
    action: "buy",
    actionLabel: "شراء",
    confidence: 86,
    reasons: [],
    dataProvenance: { freshness: "stale", marketTimestamp: "2026-09-11T20:00:00.000Z" },
    timeframes: [frame("15m", "2026-09-11T19:45:00.000Z", "15 دقيقة")]
  }, { currency: "USD", executionMarketId: "us", session: closedSession });

  assert.equal(result.action, "hold");
  assert.equal(result.marketClosed, true);
  assert.equal(result.stalePriceBlocked, undefined);
  assert.equal(result.marketSession.isOpen, false);
});
