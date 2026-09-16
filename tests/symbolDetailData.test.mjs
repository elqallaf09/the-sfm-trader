import assert from 'node:assert/strict';
import test from 'node:test';
import { nullableNumber, normalizeSymbolEvidence, explicitAction, validateSymbolDetail, createStore } from '../public/modules/symbolDetailData.js';
import { observedDailyChangePercent } from '../src/marketDataProvenance.mjs';

const valid = () => ({ symbol: 'MSFT', currentPrice: 100, confidence: 80, action: 'buy', target1: 110,
  dataProvenance: { marketTimestamp: new Date().toISOString(), freshness: 'current', provider: 'Fixture provider' },
  dataHealth: { coverage: 4, score: 80 } });
for (const input of [null, undefined, '', ' ', false, true, [], {}, NaN, Infinity, 'no-data']) {
  test(`missing/non-numeric value remains missing: ${String(input)}`, () => assert.equal(nullableNumber(input), null));
}
test('real zero stays zero and decimal string is accepted', () => { assert.equal(nullableNumber(0), 0); assert.equal(nullableNumber('0.021254'), 0.021254); });
test('unknown action never becomes buy/sell from market movement', () => {
  assert.equal(explicitAction({ changePercent: 25, expectedMovePct: -30 }, true), 'pending');
  assert.equal(explicitAction({ action: 'buy' }, false), 'pending');
});
test('expected move is not the daily change', () => {
  assert.equal(normalizeSymbolEvidence({ ...valid(), expectedMovePct: 30, expectedPrice: 130 }).changePercent, null);
  assert.equal(normalizeSymbolEvidence({ ...valid(), changePercent: 0, expectedMovePct: 30 }).changePercent, 0);
});
test('confidence and targets require price, observed freshness and technical coverage', () => {
  assert.equal(normalizeSymbolEvidence(valid()).ready, true);
  for (const patch of [{ currentPrice: 0 }, { confidence: null }, { confidence: 101 }, { confidence: -1 }, { dataHealth: null },
    { available: false }, { status: 'partial' }, { dataProvenance: { freshness: 'stale' } },
    { dataProvenance: { freshness: 'current', marketTimestamp: new Date(Date.now() + 86400000).toISOString() } }]) {
    const data = normalizeSymbolEvidence({ ...valid(), ...patch });
    assert.equal(data.ready, false); assert.equal(data.confidence, null); assert.equal(data.target, null);
  }
});
test('source observation and provider provenance are not replaced by retrieval time', () => {
  const item = { ...valid(), dataProvider: 'Finnhub', generatedAt: new Date().toISOString() };
  assert.equal(normalizeSymbolEvidence(item).source, 'Finnhub');
  assert.equal(normalizeSymbolEvidence({ ...item, dataProvenance: {} }).observedAt, '');
});
test('detail rejects missing, failed, or different symbols', () => {
  assert.equal(validateSymbolDetail({ recommendation: valid() }, 'msft').symbol, 'MSFT');
  for (const payload of [{}, { recommendation: valid(), success: false }, { recommendation: valid(), asset: { symbol: 'AAPL' } }, { recommendation: { symbol: 'AAPL' } }]) {
    assert.throws(() => validateSymbolDetail(payload, 'MSFT'));
  }
});
test('daily movement uses only provider quote fields; missing values never become zero', () => {
  assert.equal(observedDailyChangePercent({ regularMarketChangePercent: 0 }, 100), 0);
  assert.equal(observedDailyChangePercent({ previousClose: 100 }, 110), 10);
  assert.equal(observedDailyChangePercent({ previousClose: null }, 110), null);
  assert.equal(observedDailyChangePercent({ previousClose: 100 }, null), null);
  assert.equal(observedDailyChangePercent({ expectedPrice: 120 }, 110), null);
  assert.equal(observedDailyChangePercent({ chartPreviousClose: 75 }, 110), null, 'a chart-range baseline is not previous day close');
});
test('concurrent loads coalesce and successful cached results have bounded TTL', async () => {
  let now = 0, calls = 0; const store = createStore({ now: () => now, ttlMs: 10 });
  const load = () => { calls++; return { symbol: 'MSFT' }; };
  await Promise.all([store.load('MSFT', load), store.load('MSFT', load)]);
  await store.load('MSFT', load); assert.equal(calls, 1);
  now = 11; await store.load('MSFT', load); assert.equal(calls, 2);
});
test('failed request is retryable, not cached as an empty success', async () => {
  const store = createStore(); const fail = () => { throw new Error('offline'); };
  await store.load('MSFT', fail); assert.equal(store.read('MSFT').status, 'error');
  await store.load('MSFT', () => ({ value: 1 }), { force: true }); assert.equal(store.read('MSFT').status, 'success');
});
test('close, switch and eviction abort in-flight requests and discard late results', async () => {
  let release, signal, changes = 0;
  const store = createStore({ maxEntries: 1, onChange: () => changes++ });
  const pending = store.load('MSFT', arg => { signal = arg; return new Promise(resolve => { release = resolve; }); });
  await Promise.resolve(); store.cancelPending(); assert.equal(signal.aborted, true);
  release({ symbol: 'MSFT' }); await pending; assert.equal(changes, 0); assert.equal(store.read('MSFT').status, 'idle');
  await store.load('AAPL', () => 1); await store.load('NVDA', () => 2); assert.equal(store.read('AAPL').status, 'idle');
});
