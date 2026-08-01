export function createMetrics({ startedAt = Date.now(), maxRequestSeries = 250, maxVitalSeries = 100 } = {}) {
  const requests = new Map();
  const webVitals = new Map();
  let droppedRequestSeries = 0;
  let droppedVitalSeries = 0;

  function observeRequest({ method, path, status, durationMs }) {
    const route = String(path || "unknown").replace(/[^a-zA-Z0-9_./:-]/g, "_");
    const key = `${method || "GET"} ${route} ${status || 0}`;
    if (!requests.has(key) && requests.size >= maxRequestSeries) {
      droppedRequestSeries += 1;
      return;
    }
    const current = requests.get(key) || { count: 0, durationMs: 0, maxDurationMs: 0 };
    current.count += 1;
    current.durationMs += durationMs;
    current.maxDurationMs = Math.max(current.maxDurationMs, durationMs);
    requests.set(key, current);
  }

  function observeWebVital({ name, value, rating, page }) {
    if (!/^(CLS|FCP|INP|LCP|TTFB)$/.test(name) || !Number.isFinite(value)) return false;
    const key = `${name}:${String(page || "/").slice(0, 100)}`;
    if (!webVitals.has(key) && webVitals.size >= maxVitalSeries) {
      droppedVitalSeries += 1;
      return false;
    }
    const current = webVitals.get(key) || { name, page: String(page || "/"), count: 0, total: 0, max: 0, ratings: {} };
    current.count += 1;
    current.total += value;
    current.max = Math.max(current.max, value);
    current.ratings[rating || "unknown"] = (current.ratings[rating || "unknown"] || 0) + 1;
    webVitals.set(key, current);
    return true;
  }

  function snapshot() {
    return {
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      cardinality: {
        requestSeries: requests.size,
        vitalSeries: webVitals.size,
        droppedRequestSeries,
        droppedVitalSeries
      },
      requests: [...requests.entries()].map(([key, value]) => ({
        key,
        count: value.count,
        averageDurationMs: Math.round((value.durationMs / value.count) * 10) / 10,
        maxDurationMs: Math.round(value.maxDurationMs * 10) / 10
      })),
      webVitals: [...webVitals.values()].map((value) => ({
        ...value,
        average: Math.round((value.total / value.count) * 1000) / 1000,
        total: undefined
      }))
    };
  }

  return { observeRequest, observeWebVital, snapshot };
}
