import { test as it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveYahooSessionQuote } from '../src/yahooSessionQuote.mjs';
const sec = value => Date.parse(value) / 1000;
const day1 = sec('2026-09-15T13:30:00Z'), day2 = sec('2026-09-16T13:30:00Z');
const meta = { regularMarketPrice: 333.8, regularMarketTime: sec('2026-09-16T14:56:00Z'),
  chartPreviousClose: 238.15, exchangeTimezoneName: 'America/New_York' };
const quote = { close: [238.15, 331.34, 333.8], volume: [500, 600, 9244106] };
const stamps = [sec('2025-09-16T13:30:00Z'), day1, day2];
it('uses previous daily session rather than the first close of a one-year range', () => {
  const actual = resolveYahooSessionQuote(meta, stamps, quote);
  assert.equal(actual.previousClose, 331.34);
  assert.ok(Math.abs(actual.changePercent - (333.8 - 331.34) / 331.34 * 100) < 1e-9);
  assert.equal(actual.volume, 9244106);
  assert.equal(actual.previousCloseSource, 'previous_daily_session');
  assert.equal(actual.volumeAsOf, '2026-09-16T14:56:00.000Z');
});
it('prefers explicit provider previous close and reported current-session volume', () => {
  const result = resolveYahooSessionQuote({ ...meta, previousClose: 332, regularMarketVolume: 123 }, stamps, quote);
  assert.equal(result.previousClose, 332); assert.equal(result.volume, 123);
});
it('preserves a real zero in current session volume and daily change', () => {
  const result = resolveYahooSessionQuote({ ...meta, previousClose: 333.8, regularMarketVolume: 0 }, stamps, quote);
  assert.equal(result.volume, 0); assert.equal(result.changePercent, 0);
});
it('does not use prior-session volume for a quote whose current bar is absent', () => {
  const result = resolveYahooSessionQuote(meta, [day1], { close: [331.34], volume: [600] });
  assert.equal(result.previousClose, 331.34); assert.equal(result.volume, null); assert.equal(result.volumeAsOf, null);
});
it('does not use weekly or intraday bars as the prior daily close or session volume', () => {
  for (const interval of ['1wk', '15m']) {
    const result = resolveYahooSessionQuote(meta, stamps, quote, interval);
    assert.equal(result.previousClose, null); assert.equal(result.volume, null);
  }
});
it('keeps nulls for unproved previous close, missing timezone and invalid provider numbers', () => {
  const result = resolveYahooSessionQuote({ ...meta, exchangeTimezoneName: undefined, previousClose: '', regularMarketVolume: false }, stamps, quote);
  assert.equal(result.previousClose, null); assert.equal(result.changePercent, null); assert.equal(result.volume, null);
});
it('does not collapse null candle holes or borrow a future bar', () => {
  const result = resolveYahooSessionQuote(meta, [day1, day1 + 60, day2, day2 + 86400],
    { close: [331.34, null, 333.8, 999], volume: [600, 0, 123, 9000] });
  assert.equal(result.previousClose, 331.34); assert.equal(result.volume, 123);
});
it('uses exchange-local sessions across a weekend', () => {
  const result = resolveYahooSessionQuote({ regularMarketPrice: 105, regularMarketTime: sec('2026-09-13T23:30:00Z'),
    exchangeTimezoneName: 'Australia/Sydney', chartPreviousClose: 50 },
    [sec('2026-09-10T23:00:00Z'), sec('2026-09-13T23:00:00Z')], { close: [100, 105], volume: [900, 50] });
  assert.equal(result.previousClose, 100); assert.equal(result.changePercent, 5); assert.equal(result.volume, 50);
});
it('retains explicit observed percent change when previous close is unavailable', () => {
  assert.equal(resolveYahooSessionQuote({ ...meta, regularMarketChangePercent: 0 }).changePercent, 0);
  assert.equal(resolveYahooSessionQuote({ ...meta, regularMarketPrice: null, regularMarketChangePercent: 3 }).changePercent, null);
});
it('does not invent a volume timestamp when the observation time is missing', () => {
  const result = resolveYahooSessionQuote({ regularMarketPrice: 10, regularMarketVolume: 100, previousClose: 9 });
  assert.equal(result.volume, null); assert.equal(result.asOf, null);
});
