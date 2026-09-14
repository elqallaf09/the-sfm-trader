import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  canExecuteRecommendation,
  guardRecommendationForDisplay,
  priceObservationState
} from '../public/modules/marketIntegrity.js';

const fixtureUrl = new URL('../tools/fixtures/home-v3.mjs', import.meta.url).href;
const epoch = Date.parse('2026-09-14T14:00:00.000Z');

// Import the real shared fixture under an advancing clock. A child process keeps
// the clock replacement and ESM cache isolated from every other test file.
const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
  const RealDate = Date;
  let reads = 0;
  class AdvancingDate extends RealDate {
    constructor(...args) {
      if (args.length) super(...args);
      else super(${epoch} + reads++);
    }
    static now() { return ${epoch} + reads++; }
  }
  globalThis.Date = AdvancingDate;
  let fixture;
  try { ({ fixture } = await import(${JSON.stringify(fixtureUrl)})); }
  finally { globalThis.Date = RealDate; }
  process.stdout.write(JSON.stringify({ fixture, reads }));
`], { encoding: 'utf8', timeout: 5000, maxBuffer: 1024 * 1024 });
assert.ifError(child.error);
assert.equal(child.status, 0, child.stderr);
const snapshot = JSON.parse(child.stdout);
const { recommendations } = snapshot.fixture;
assert.ok(recommendations.length > 0, 'The actual browser fixture must contain observations');

// Coherent controls isolate production guard behavior from fixture construction.
function controlQuote() {
  const quote = structuredClone(recommendations.find(item => item.action === 'buy'));
  assert.ok(quote, 'A positive-control Buy recommendation must exist');
  quote.priceFreshness.marketTimestamp = new Date(epoch).toISOString();
  quote.dataProvenance.marketTimestamp = quote.priceFreshness.marketTimestamp;
  return quote;
}

test('browser fixture keeps source and displayed quote timestamps identical under clock advancement', () => {
  for (const item of recommendations) {
    assert.equal(item.priceFreshness.marketTimestamp, item.dataProvenance.marketTimestamp, item.symbol);
  }
});

test('browser fixture reads one snapshot clock and shares it with generatedAt and every quote', () => {
  assert.equal(snapshot.reads, 1, 'One logical snapshot must not read the clock per field');
  assert.equal(snapshot.fixture.generatedAt, new Date(epoch).toISOString());
  for (const item of recommendations) {
    assert.equal(item.dataProvenance.marketTimestamp, snapshot.fixture.generatedAt, item.symbol);
  }
});

test('the unchanged display guard accepts the coherent fixture without upgrading Hold', () => {
  const now = epoch + 100;
  for (const item of recommendations) {
    assert.equal(priceObservationState(item, now), 'current', item.symbol);
    assert.equal(guardRecommendationForDisplay(item, { now }).action, item.action, item.symbol);
    assert.equal(canExecuteRecommendation(item, now), ['buy', 'sell'].includes(item.action), item.symbol);
  }
});

test('production guard still rejects a one-millisecond source/display mismatch', () => {
  const quote = controlQuote();
  assert.equal(canExecuteRecommendation(quote, epoch), true);
  for (const delta of [-1, 1]) {
    const mismatch = structuredClone(quote);
    mismatch.dataProvenance.marketTimestamp = new Date(epoch + delta).toISOString();
    assert.equal(priceObservationState(mismatch, epoch + 100), 'unknown');
    assert.equal(canExecuteRecommendation(mismatch, epoch + 100), false);
    assert.equal(guardRecommendationForDisplay(mismatch, { now: epoch + 100 }).action, 'hold');
  }
});

test('production freshness limit is unchanged at the exact deadline and one millisecond after it', () => {
  const quote = controlQuote();
  assert.equal(quote.priceFreshness.maxAgeSeconds, 1200);
  const deadline = epoch + quote.priceFreshness.maxAgeSeconds * 1000;
  assert.equal(canExecuteRecommendation(quote, deadline), true);
  assert.equal(priceObservationState(quote, deadline + 1), 'stale');
  assert.equal(canExecuteRecommendation(quote, deadline + 1), false);
  const guarded = guardRecommendationForDisplay(quote, { now: deadline + 1 });
  assert.equal(guarded.action, 'hold');
  assert.equal(guarded.executionBlocked, true);
  assert.equal(quote.action, 'buy', 'Guard must not mutate its input');
});
