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

try {
  await validateDuplicateSymbolConsistency();
} catch (error) {
  failed = true;
  console.error(`[failed] duplicate symbol consistency: ${error.message}`);
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

async function fetchJson(path) {
  const response = await fetchWithTimeout(`${baseUrl}${path}`, timeoutMs);
  const text = await response.text();
  const data = JSON.parse(text || "{}");

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${data.error || "request failed"}`);
  }

  return data;
}

async function validateDuplicateSymbolConsistency() {
  const [kuwait, gcc] = await Promise.all([
    fetchJson("/api/recommendations?market=kuwait"),
    fetchJson("/api/recommendations?market=gcc")
  ]);
  const kuwaitZain = findRecommendation(kuwait, "ZAIN.KW");
  const gccZain = findRecommendation(gcc, "ZAIN.KW");

  if (!kuwaitZain || !gccZain) {
    throw new Error("ZAIN.KW was not present in both Kuwait and GCC payloads");
  }

  const kuwaitSetup = kuwaitZain.setupAction || kuwaitZain.action;
  const gccSetup = gccZain.setupAction || gccZain.action;
  const sameDecision = kuwaitZain.action === gccZain.action && kuwaitSetup === gccSetup;
  const sameExecutionMarket = kuwaitZain.executionMarketId === gccZain.executionMarketId;

  if (!sameDecision || !sameExecutionMarket) {
    throw new Error(
      `ZAIN.KW mismatch: kuwait=${kuwaitZain.action}/${kuwaitSetup}/${kuwaitZain.executionMarketId}, ` +
      `gcc=${gccZain.action}/${gccSetup}/${gccZain.executionMarketId}`
    );
  }

  console.log(`[ok] duplicate symbol consistency ZAIN.KW (${kuwaitZain.action}/${kuwaitSetup})`);
}

function findRecommendation(payload, symbol) {
  return (payload.recommendations || []).find((item) => item.symbol === symbol);
}
