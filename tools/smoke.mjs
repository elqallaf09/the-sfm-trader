const baseUrl = (process.env.SFM_BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const timeoutMs = Number(process.env.SFM_SMOKE_TIMEOUT_MS || 25_000);

const checks = [
  { path: "/", type: "text", name: "home" },
  { path: "/manifest.webmanifest", type: "json", name: "manifest", validate: (data) => data.name && data.icons },
  { path: "/api/markets", type: "json", name: "markets", validate: (data) => Array.isArray(data.markets) && data.markets.length > 0 },
  { path: "/api/recommendations?market=us", type: "json", name: "us recommendations", validate: validateRecommendationsPayload },
  { path: "/api/recommendations?market=forex", type: "json", name: "forex recommendations", validate: validateRecommendationsPayload },
  { path: "/api/recommendations?market=crypto", type: "json", name: "crypto recommendations", validate: validateRecommendationsPayload },
  { path: "/api/economic-calendar", type: "json", name: "economic calendar" },
  { path: "/api/followed-trades", type: "json", name: "followed trades" },
  { path: "/api/notifications", type: "json", name: "notifications" },
  { path: "/api/asset?symbol=AAPL", type: "json", name: "asset AAPL", validate: (data) => data.symbol === "AAPL" || data.asset?.symbol === "AAPL" }
];

let failed = false;

for (const check of checks) {
  const startedAt = performance.now();

  try {
    const response = await fetchWithTimeout(`${baseUrl}${check.path}`, timeoutMs);
    const elapsed = Math.round(performance.now() - startedAt);
    const text = await response.text();
    const data = check.type === "json" ? JSON.parse(text || "{}") : text;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${typeof data === "string" ? data.slice(0, 160) : data.error || "request failed"}`);
    }

    if (check.validate && !check.validate(data)) {
      throw new Error("response shape did not match expected contract");
    }

    console.log(`[ok] ${check.name} ${elapsed}ms`);
  } catch (error) {
    failed = true;
    console.error(`[failed] ${check.name}: ${error.message}`);
  }
}

if (failed) {
  console.error(`Smoke failed against ${baseUrl}`);
  process.exit(1);
}

console.log(`Smoke passed against ${baseUrl}`);

function validateRecommendationsPayload(data) {
  return Boolean(
    data?.market?.id &&
    Array.isArray(data.recommendations) &&
    Array.isArray(data.unavailable || []) &&
    data.dataProvider &&
    data.refreshPolicy
  );
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    return await fetch(url, {
      cache: "no-store",
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}
