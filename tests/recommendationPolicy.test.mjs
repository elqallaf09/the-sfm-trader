import assert from "node:assert/strict";
import test from "node:test";
import { finalizeRecommendation } from "../src/recommendationPolicy.mjs";
const item = { symbol: "AAPL", action: "buy", actionLabel: "شراء", confidence: 80, decision: { kind: "buy", title: "Buy", message: "Buy now" } };
test("closed-session policy preserves setup but removes executable and textual buy instructions", () => {
  const result = finalizeRecommendation(item, { currency: "USD", executionMarketId: "us", session: { isOpen: false } });
  assert.equal(result.action, "hold");
  assert.equal(result.setupAction, "buy");
  assert.equal(result.decision.kind, "hold");
  assert.notEqual(result.decision.message, "Buy now");
  assert.equal(result.marketClosed, true);
  assert.equal(item.action, "buy");
});
test("open sessions preserve actual analysis and missing confidence stays missing", () => {
  assert.equal(finalizeRecommendation(item, { session: { isOpen: true } }).action, "buy");
  assert.equal(finalizeRecommendation({ ...item, confidence: null }, { session: { isOpen: false } }).confidence, null);
});
