const PROVIDER_SOURCES = Object.freeze({
  "Yahoo Finance": "https://finance.yahoo.com/",
  Finnhub: "https://finnhub.io/",
  "Alpha Vantage": "https://www.alphavantage.co/",
  "Twelve Data": "https://twelvedata.com/"
});

export function buildMarketDataProvenance({ provider, symbol, marketTimestamp, retrievedAt = new Date().toISOString(), stale = false }) {
  const normalizedProvider = String(provider || "Unknown").trim() || "Unknown";
  const timestampSeconds = Number(marketTimestamp || 0);
  const marketTime = Number.isFinite(timestampSeconds) && timestampSeconds > 0
    ? new Date(timestampSeconds * 1000).toISOString()
    : null;
  const retrievedMs = Date.parse(retrievedAt);
  const ageSeconds = marketTime && Number.isFinite(retrievedMs)
    ? Math.max(0, Math.round((retrievedMs - Date.parse(marketTime)) / 1000))
    : null;

  return {
    provider: normalizedProvider,
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
