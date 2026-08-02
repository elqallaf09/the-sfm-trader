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
    const metricName = String(name || "").toUpperCase();
    const metricValue = Number(value);
    if (!/^(CLS|FCP|INP|LCP|TTFB)$/.test(metricName) || !isPlausibleVital(metricName, metricValue)) return false;
    const normalizedPage = normalizePage(page);
    const normalizedRating = ["good", "needs-improvement", "poor"].includes(String(rating)) ? String(rating) : "unknown";
    const key = `${metricName}:${normalizedPage}`;
    if (!webVitals.has(key) && webVitals.size >= maxVitalSeries) {
      droppedVitalSeries += 1;
      return false;
    }
    const current = webVitals.get(key) || { name: metricName, page: normalizedPage, count: 0, total: 0, max: 0, ratings: {} };
    current.count += 1;
    current.total += metricValue;
    current.max = Math.max(current.max, metricValue);
    current.ratings[normalizedRating] = (current.ratings[normalizedRating] || 0) + 1;
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

function isPlausibleVital(name, value) {
  if (!Number.isFinite(value) || value < 0) return false;
  return name === "CLS" ? value <= 100 : value <= 600_000;
}

function normalizePage(value) {
  const page = String(value || "/").split(/[?#]/, 1)[0].slice(0, 100);
  return /^\/[A-Za-z0-9_./-]*$/.test(page) ? page : "/unknown";
}
