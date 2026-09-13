import assert from "node:assert/strict";
import test from "node:test";
import { toNullableNumber } from "../public/modules/numberValue.js";
import { calculateFinalScore, getAnalysisMetrics, getRecommendationAction } from "../public/modules/analysisMetrics.js";

test("missing numeric values remain missing and real zero is preserved", () => {
  for (const value of [null, undefined, "", " ", false, true, [], {}, NaN, Infinity]) {
    assert.equal(toNullableNumber(value), null);
  }
  assert.equal(toNullableNumber(0), 0);
  assert.equal(toNullableNumber("0"), 0);
  assert.equal(toNullableNumber("12.50"), 12.5);
});

test("improved data health cannot reduce the composite score", () => {
  let previous = -1;
  for (let health = 0; health <= 100; health++) {
    const score = calculateFinalScore({ confidence: 76, dataHealth: { score: health } }).score;
    assert.ok(score >= previous, "Score decreased at health " + health);
    previous = score;
  }
});

test("all missing win-rate representations use the same fallback", () => {
  const expected = calculateFinalScore({ confidence: 76 }).score;
  for (const winRate of [undefined, null, "", " ", "invalid"]) {
    assert.equal(calculateFinalScore({ confidence: 76, backtest: { winRate } }).score, expected);
  }
  assert.equal(getAnalysisMetrics({}).score, null);
  assert.equal(getAnalysisMetrics({ confidence: 0 }).confidence, 0);
  assert.equal(getAnalysisMetrics({ target1: null, expectedPrice: 112 }).target, 112);
});

test("an absent or unknown recommendation action cannot become a trade", () => {
  assert.equal(getRecommendationAction({ expectedMovePct: 12, confidence: 90 }), "pending");
  assert.equal(getRecommendationAction({ action: "unknown", expectedMovePct: -12 }), "pending");
  for (const action of ["buy", "sell", "hold"]) assert.equal(getRecommendationAction({ action }), action);
});
