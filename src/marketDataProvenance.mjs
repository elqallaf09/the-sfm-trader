import { epochSecondsToMs } from "../public/modules/marketIntegrity.js";
const PROVIDER_SOURCES = Object.freeze({
  "Yahoo Finance": "https://finance.yahoo.com/",
  Finnhub: "https://finnhub.io/",
  "Alpha Vantage": "https://www.alphavantage.co/",
  "Twelve Data": "https://twelvedata.com/"
});

export function buildMarketDataProvenance({ provider, symbol, marketTimestamp, retrievedAt = new Date().toISOString(), stale = false, priceKind = null, priceInterval = null }) {
  const normalizedProvider = String(provider || "Unknown").trim() || "Unknown";
  const timestampMs = epochSecondsToMs(marketTimestamp);
  const marketTime = timestampMs !== null
    ? new Date(timestampMs).toISOString()
    : null;
  const retrievedMs = Date.parse(retrievedAt);
  const ageSeconds = marketTime && Number.isFinite(retrievedMs)
    ? Math.max(0, Math.round((retrievedMs - Date.parse(marketTime)) / 1000))
    : null;

  return {
    provider: normalizedProvider,
    priceKind, priceInterval,
    sourceUrl: PROVIDER_SOURCES[normalizedProvider] || null,
    symbol: String(symbol || "").trim(),
    marketTimestamp: marketTime,
    retrievedAt,
    ageSeconds,
    freshness: stale ? "stale" : marketTime ? "current" : "unknown",
    delayDisclosure: normalizedProvider === "Yahoo Finance"
      ? "Market data may be delayed according to exchange and provider terms."
      : "Latency depends on the active provider plan and exchange."
  };
}

// Percent change against the provider's previous close, not an analyst price target.
export function observedDailyChangePercent(meta = {}, currentPrice) {
  const finite = value => (typeof value === "number" || (typeof value === "string" && value.trim())) && Number.isFinite(Number(value)) ? Number(value) : null;
  const explicit = finite(meta.regularMarketChangePercent);
  if (explicit !== null) return explicit;
  const previous = finite(meta.previousClose);
  const current = finite(currentPrice);
  return previous !== null && previous > 0 && current !== null && current > 0 ? (current - previous) / previous * 100 : null;
}
