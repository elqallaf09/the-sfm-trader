import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const syntaxFiles = [
  "server.mjs",
  "src/analysis.mjs",
  "src/dataProviders.mjs",
  "src/markets.mjs",
  "src/economicCalendar.mjs",
  "src/security.mjs",
  "src/fileStore.mjs",
  "src/http.mjs",
  "src/boundedCache.mjs",
  "src/stateStore.mjs",
  "src/postgresStore.mjs",
  "src/staticServer.mjs",
  "src/metrics.mjs",
  "src/marketDataProvenance.mjs",
  "public/app.js",
  "public/detail.js",
  "public/modules/apiClient.js",
  "public/modules/polling.js",
  "public/modules/uiState.js",
  "public/modules/webVitals.js",
  "public/modules/marketBackground.js",
  "public/modules/boundedMemoryCache.js",
  "public/modules/requestPolicy.js",
  "tools/set-ios-server-url.mjs",
  "tools/smoke.mjs",
  "tools/migrate.mjs",
  "tools/production-preflight.mjs",
  "tools/normalize-terminal-css.mjs",
  "tests/postgres.integration.mjs"
];

const jsonFiles = [
  "package.json",
  "capacitor.config.json",
  "public/manifest.webmanifest"
];

let failed = false;
const nonLatinDigits = /[\u0660-\u0669\u06F0-\u06F9]/;

function normalizeDigits(value) {
  return String(value ?? "")
    .replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (digit) => {
      const code = digit.charCodeAt(0);
      return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
    })
    .replace(/\u066B/g, ".")
    .replace(/\u066C/g, ",")
    .replace(/\u066A/g, "%")
    .replace(/[\u061C\u200E\u200F]/g, "");
}

for (const file of syntaxFiles) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
    shell: false
  });

  if (result.status !== 0) {
    failed = true;
    console.error(`[syntax failed] ${file}`);
    if (result.stderr) console.error(result.stderr.trim());
  } else {
    console.log(`[syntax ok] ${file}`);
  }
}

for (const file of jsonFiles) {
  try {
    JSON.parse(readFileSync(file, "utf8"));
    console.log(`[json ok] ${file}`);
  } catch (error) {
    failed = true;
    console.error(`[json failed] ${file}: ${error.message}`);
  }
}

const normalizedSample = normalizeDigits("\u0661\u0662\u0663 \u06F4\u06F5\u06F6 \u0664\u0665\u066B\u0666\u0667\u066A");
if (normalizedSample !== "123 456 45.67%" || nonLatinDigits.test(normalizedSample)) {
  failed = true;
  console.error("[latin-digits failed] digit normalization fallback");
} else {
  console.log("[latin-digits ok] digit normalization fallback");
}

for (const file of ["public/app.js", "public/detail.js"]) {
  const content = readFileSync(file, "utf8");
  const hasNormalizer = content.includes("function normalizeDigits");
  const rawArabicIntl = /new Intl\.(?:NumberFormat|DateTimeFormat)\(\s*["']ar(?:-|["'])/.test(content);
  const rawArabicLocale = /\.toLocale(?:String|DateString|TimeString)\(\s*["']ar(?:-|["'])/.test(content);
  if (!hasNormalizer || rawArabicIntl || rawArabicLocale) {
    failed = true;
    console.error(`[latin-digits failed] ${file}`);
  } else {
    console.log(`[latin-digits ok] ${file}`);
  }
}

const serverSource = readFileSync("server.mjs", "utf8");
const appSource = readFileSync("public/app.js", "utf8");
const detailSource = readFileSync("public/detail.js", "utf8");
const serviceWorkerSource = readFileSync("public/service-worker.js", "utf8");
const indexSource = readFileSync("public/index.html", "utf8");
const stylesSource = readFileSync("public/styles.css", "utf8");
const capacitorConfig = JSON.parse(readFileSync("capacitor.config.json", "utf8"));
if (!serverSource.includes("requireIdentity(request, response)") || serverSource.includes('"access-control-allow-origin": "*"')) {
  failed = true;
  console.error("[security failed] protected API identity or CORS guard is missing");
} else {
  console.log("[security ok] protected API identity and restricted CORS");
}
if (serverSource.includes("request.headers.host")) {
  failed = true;
  console.error("[host validation failed] URL parsing must not trust the incoming Host header");
} else {
  console.log("[host validation ok] request routing ignores untrusted Host values");
}
if (/const\s+staticNews\s*=/.test(appSource)) {
  failed = true;
  console.error("[truthfulness failed] static news must not appear as live market news");
} else {
  console.log("[truthfulness ok] no static news masquerading as live content");
}
if (/\+(?:1\.27|1\.04|0\.34|0\.52|1\.18)%|39,872\.11|67,345\.12/.test(indexSource)) {
  failed = true;
  console.error("[truthful initial UI failed] static market prices or changes must not appear as live data");
} else {
  console.log("[truthful initial UI ok] live market widgets start without fabricated values");
}
if (/localStorage\.getItem\(API_TOKEN_STORAGE_KEY\)/.test(`${appSource}\n${detailSource}`)) {
  failed = true;
  console.error("[credential storage failed] API tokens must not persist in localStorage");
} else {
  console.log("[credential storage ok] API tokens are session-scoped");
}
if (!serviceWorkerSource.includes("Promise.allSettled") || !serviceWorkerSource.includes("response.type === \"basic\"")) {
  failed = true;
  console.error("[pwa resilience failed] service worker must tolerate partial precache failures and cache only same-origin basic responses");
} else {
  console.log("[pwa resilience ok] service worker uses resilient and origin-safe caching");
}
if (/\.loading-indicator\s*\{[^}]*display\s*:\s*none\s*!important/i.test(stylesSource)) {
  failed = true;
  console.error("[ux state failed] loading status must remain visible");
} else {
  console.log("[ux state ok] loading status remains visible");
}
if (capacitorConfig.server?.cleartext || /^http:\/\//i.test(capacitorConfig.server?.url || "")) {
  failed = true;
  console.error("[ios security failed] release Capacitor config contains cleartext server settings");
} else {
  console.log("[ios security ok] no cleartext release server settings");
}

if (failed) {
  console.error("Check failed.");
  process.exit(1);
}

console.log("Check passed.");
