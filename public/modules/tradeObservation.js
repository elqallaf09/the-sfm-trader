import { canExecuteRecommendation, hasCurrentPriceObservation, isoTimestampMs, normalizeQuoteCurrency } from './marketIntegrity.js?v=20260914-lifecycle-1';
import { toPositiveNumber, toNullableNumber } from './numberValue.js?v=20260914-issue40-1';

const timestampOf = item => isoTimestampMs(item?.priceFreshness?.marketTimestamp || item?.dataProvenance?.marketTimestamp);
const terminal = entry => ['target', 'stop'].includes(entry?.outcome);

// Observation can update an existing trade during a news/entry block. It must
// still be fresh, after entry, monotonic, the same instrument AND the same unit.
export function canObserveTrade(entry, item, now = Date.now()) {
  if (!entry || !hasCurrentPriceObservation(item, now) || !['buy', 'sell'].includes(entry.action)) return false;
  if (String(entry.symbol).toUpperCase() !== String(item.symbol).toUpperCase()) return false;
  const unit = normalizeQuoteCurrency(entry.currency);
  if (!unit || unit !== normalizeQuoteCurrency(item.currency)) return false;
  const opened = isoTimestampMs(entry.entryObservedAt || entry.firstSeen);
  const observed = timestampOf(item);
  const previous = isoTimestampMs(entry.lastObservationAt);
  return opened !== null && observed !== null && observed > opened && (previous === null || observed >= previous)
    && toPositiveNumber(entry.entryPrice ?? entry.currentPrice) !== null;
}

export function observeTrade(entry, item, now = Date.now()) {
  if (terminal(entry) || !canObserveTrade(entry, item, now)) return entry;
  const timestamp = timestampOf(item);
  if (timestamp === isoTimestampMs(entry.lastObservationAt)) return entry;
  const price = toPositiveNumber(item.currentPrice);
  const initial = toPositiveNumber(entry.entryPrice ?? entry.currentPrice);
  const selling = entry.action === 'sell';
  const targetValue = toPositiveNumber(entry.target1 ?? entry.expectedPrice);
  const stopValue = toPositiveNumber(entry.stopLoss);
  const target = targetValue !== null && (selling ? targetValue < initial : targetValue > initial) ? targetValue : null;
  const stop = stopValue !== null && (selling ? stopValue > initial : stopValue < initial) ? stopValue : null;
  const targetHit = target !== null && (selling ? price <= target : price >= target);
  const stopHit = !targetHit && stop !== null && (selling ? price >= stop : price <= stop);
  const best = toPositiveNumber(entry.bestPrice) ?? initial;
  const worst = toPositiveNumber(entry.worstPrice) ?? initial;
  const observedAt = new Date(timestamp).toISOString();
  return {...entry, lastPrice:price, lastObservationAt:observedAt, lastSeen:new Date(now).toISOString(),
    observedReturnPct:toNullableNumber((price - initial) / initial * 100 * (selling ? -1 : 1)),
    bestPrice:selling ? Math.min(best, price) : Math.max(best, price),
    worstPrice:selling ? Math.max(worst, price) : Math.min(worst, price),
    targetHit, stopHit, outcome:targetHit ? 'target' : stopHit ? 'stop' : 'pending',
    hitAt:targetHit ? observedAt : null, stopAt:stopHit ? observedAt : null};
}

export function recordTradeHistory(history, items, now = Date.now()) {
  const quotes = new Map(items.filter(item => item?.symbol).map(item => [String(item.symbol).toUpperCase(), item]));
  const byKey = new Map(history.map(entry => [entry.key, observeTrade(entry, quotes.get(String(entry.symbol).toUpperCase()), now)]));
  for (const item of items) {
    if (!canExecuteRecommendation(item, now)) continue;
    const key = `${item.symbol}:${item.action}`;
    if (byKey.has(key)) continue; // Existing entry/thresholds/outcomes are immutable.
    const price = toPositiveNumber(item.currentPrice);
    const observedAt = new Date(timestampOf(item)).toISOString();
    byKey.set(key, {
      key, symbol:item.symbol, name:item.name, action:item.action, actionLabel:item.actionLabel,
      currentPrice:price, entryPrice:price, lastPrice:price, currency:item.currency,
      expectedPrice:toPositiveNumber(item.expectedPrice), target1:toPositiveNumber(item.target1 ?? item.expectedPrice),
      target2:toPositiveNumber(item.target2), stopLoss:toPositiveNumber(item.stopLoss),
      confidence:item.confidence, expectedMovePct:item.expectedMovePct, riskReward:item.riskReward, analysisQuality:item.analysisQuality,
      firstSeen:new Date(now).toISOString(), lastSeen:new Date(now).toISOString(),
      entryObservedAt:observedAt, lastObservationAt:observedAt,
      targetHit:false, stopHit:false, outcome:'pending', hitAt:null, stopAt:null,
      observedReturnPct:0, bestPrice:price, worstPrice:price
    });
  }
  return byKey;
}
