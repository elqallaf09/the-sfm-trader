import test from 'node:test';
import assert from 'node:assert/strict';
import { finalizeRecommendation, getFastPriceFreshness } from '../src/recommendationPolicy.mjs';
const now = Date.parse('2026-09-14T14:00:00Z');
test('missing provenance cannot bypass the executable-signal guard', () => {
  const value = finalizeRecommendation({symbol:'AAPL',action:'buy',confidence:80}, {session:{isOpen:true}, now});
  assert.equal(value.action, 'hold');
});
test('future intraday timestamps are not fresh observations', () => {
  const value = getFastPriceFreshness({timeframes:[{id:'1m',latestTimestamp:(now+86400000)/1000}]}, now);
  assert.notEqual(value.state,'current');
});
test('out-of-range timestamps cannot crash freshness evaluation', () => {
  assert.doesNotThrow(()=>getFastPriceFreshness({timeframes:[{id:'1m',latestTimestamp:1e30}]},now));
});
test('unknown execution sessions fail closed', () => {
  assert.equal(finalizeRecommendation({symbol:'NESN.SW',action:'buy'}, {session:null,now}).action,'hold');
});
