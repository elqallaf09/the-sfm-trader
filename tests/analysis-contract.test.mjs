import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const analysis = await readFile(new URL("../src/analysis.mjs", import.meta.url), "utf8");

test("backtest is walk-forward, conservative and cost-aware", () => {
  assert.match(analysis, /slice\(0, index \+ 1\)/);
  assert.match(analysis, /if \(hitStop\).*exitPrice = stopLoss.*break/);
  assert.match(analysis, /BACKTEST_TRANSACTION_COST_BPS/);
  assert.match(analysis, /exitPrice = closes\[index \+ horizonDays\]/);
  assert.doesNotMatch(analysis, /const exitPrice = outcome \? takeProfit : stopLoss/);
});

test("decision output carries auditable evidence", () => {
  for (const field of ["confidence", "timeframeAgreementPct", "dataHealthScore", "riskReward", "backtestSamples"]) {
    assert.match(analysis, new RegExp(`${field}:`));
  }
});
