import { API_TOKEN_STORAGE_KEY } from "./apiClient.js";
import { fetchResponseWithPolicy } from "./requestPolicy.js";

const supported = typeof PerformanceObserver !== "undefined";
const latest = new Map();

function report(name, value, rating) {
  if (!Number.isFinite(value)) return;
  const key = `${name}:${Math.round(value)}`;
  if (latest.get(name) === key) return;
  latest.set(name, key);
  const token = window.sessionStorage.getItem(API_TOKEN_STORAGE_KEY);
  const headers = new Headers({ "content-type": "application/json" });
  if (token) headers.set("authorization", `Bearer ${token}`);
  fetchResponseWithPolicy("/api/telemetry/web-vitals", {
    timeoutMs: 10_000,
    requestInit: {
      method: "POST",
      headers,
      body: JSON.stringify({ name, value, rating, page: window.location.pathname }),
      keepalive: true
    }
  }).then((response) => response.body?.cancel()).catch(() => {});
}

function rating(name, value) {
  const limits = { CLS: [0.1, 0.25], FCP: [1800, 3000], INP: [200, 500], LCP: [2500, 4000], TTFB: [800, 1800] }[name];
  if (!limits) return "unknown";
  return value <= limits[0] ? "good" : value <= limits[1] ? "needs-improvement" : "poor";
}

if (supported) {
  try {
    new PerformanceObserver((list) => {
      const entry = list.getEntries().at(-1);
      if (entry) report("LCP", entry.startTime, rating("LCP", entry.startTime));
    }).observe({ type: "largest-contentful-paint", buffered: true });

    let cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) cls += entry.value;
      report("CLS", cls, rating("CLS", cls));
    }).observe({ type: "layout-shift", buffered: true });

    new PerformanceObserver((list) => {
      const entry = list.getEntries().sort((a, b) => b.duration - a.duration)[0];
      if (entry) report("INP", entry.duration, rating("INP", entry.duration));
    }).observe({ type: "event", buffered: true, durationThreshold: 40 });
  } catch {
    // Unsupported entry types are expected on older WebViews.
  }
}

window.addEventListener("load", () => {
  const navigation = performance.getEntriesByType("navigation")[0];
  if (navigation) report("TTFB", navigation.responseStart, rating("TTFB", navigation.responseStart));
  const paint = performance.getEntriesByName("first-contentful-paint")[0];
  if (paint) report("FCP", paint.startTime, rating("FCP", paint.startTime));
}, { once: true });
