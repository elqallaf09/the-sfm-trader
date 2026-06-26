import http from "node:http";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeSymbol } from "./src/analysis.mjs";
import { getConfiguredProvider } from "./src/dataProviders.mjs";
import { applyEconomicNewsOverlayToRecommendations, getEconomicCalendarForMarket } from "./src/economicCalendar.mjs";
import { getMarketSummaries, markets } from "./src/markets.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const sharedStatePath = path.join(__dirname, "the-sfm-trader-shared-state.json");
const notificationLogPath = path.join(__dirname, "the-sfm-trader-notifications.json");
loadEnvFile(path.join(__dirname, ".env"));
const preferredPort = Number(process.env.PORT || 4173);
const cache = new Map();
const CACHE_TTL_MS = 90_000;
const STALE_CACHE_TTL_MS = 10 * 60_000;
const FIRST_RESPONSE_BUDGET_MS = Number(process.env.FIRST_RESPONSE_BUDGET_MS || 5_000);
const UI_RECOMMENDATION_REFRESH_MS = Number(process.env.UI_RECOMMENDATION_REFRESH_MS || 12_000);
const ANALYSIS_CONCURRENCY = Number(process.env.ANALYSIS_CONCURRENCY || 4);
const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";
const OLLAMA_ENABLED = String(process.env.OLLAMA_ENABLED || "true").toLowerCase() !== "false";
const SHARIA_API_URL = (process.env.SHARIA_API_URL || "").replace(/\/$/, "");
const SHARIA_API_KEY = process.env.SHARIA_API_KEY || "";
let ollamaUnavailableUntil = 0;
const shariaCache = new Map();
const aggregateMarketIds = new Set(["gcc", "world"]);
const canonicalMarketPriority = [
  "kuwait",
  "saudi",
  "uae",
  "qatar",
  "bahrain",
  "oman",
  "us",
  "forex",
  "commodities",
  "crypto",
  "healthcare",
  "tech",
  "ai",
  "dividends",
  "food",
  "europe",
  "asia"
];
const symbolExecutionMarketCache = new Map();
const symbolAliases = {
  APPLE: "AAPL",
  APPL: "AAPL",
  MICROSOFT: "MSFT",
  MS: "MSFT",
  NVD: "NVDA",
  NVIDIA: "NVDA",
  TESLA: "TSLA",
  GOOGLE: "GOOGL",
  ALPHABET: "GOOGL",
  AMAZON: "AMZN",
  FACEBOOK: "META",
  KFH: "KFH.KW",
  NBK: "NBK.KW",
  ZAIN: "ZAIN.KW",
  USDJPY: "USDJPY=X",
  EURUSD: "EURUSD=X",
  GBPUSD: "GBPUSD=X",
  USDCHF: "USDCHF=X",
  AUDUSD: "AUDUSD=X",
  USDCAD: "USDCAD=X",
  NZDUSD: "NZDUSD=X",
  EURGBP: "EURGBP=X",
  BTC: "BTC-USD",
  BITCOIN: "BTC-USD",
  ETH: "ETH-USD",
  ETHEREUM: "ETH-USD",
  BNB: "BNB-USD",
  SOL: "SOL-USD",
  SOLANA: "SOL-USD",
  XRP: "XRP-USD",
  ADA: "ADA-USD",
  CARDANO: "ADA-USD",
  DOGE: "DOGE-USD",
  AVAX: "AVAX-USD",
  LINK: "LINK-USD",
  DOT: "DOT-USD",
  GOLD: "GC=F",
  SILVER: "SI=F",
  OIL: "CL=F",
  WTI: "CL=F",
  BRENT: "BZ=F",
  GAS: "NG=F",
  COPPER: "HG=F",
  COFFEE: "KC=F",
  COCOA: "CC=F",
  US100: "^NDX",
  NAS100: "^NDX",
  NASDAQ100: "^NDX",
  NDX: "^NDX",
  US500: "^GSPC",
  SPX500: "^GSPC",
  SP500: "^GSPC",
  SPX: "^GSPC",
  US30: "^DJI",
  DJ30: "^DJI",
  DOW: "^DJI",
  DJI: "^DJI",
  US2000: "^RUT",
  RUSSELL2000: "^RUT",
  RUT: "^RUT",
  VIX: "^VIX",
  GER40: "^GDAXI",
  DAX40: "^GDAXI",
  DAX: "^GDAXI",
  UK100: "^FTSE",
  FTSE: "^FTSE",
  JP225: "^N225",
  NIKKEI: "^N225",
  HK50: "^HSI",
  HSI: "^HSI",
  LILLY: "LLY",
  ELI: "LLY",
  PFIZER: "PFE",
  MODERNA: "MRNA",
  JOHNSON: "JNJ",
  MERCK: "MRK",
  ABBVIE: "ABBV",
  AMGEN: "AMGN",
  GILEAD: "GILD",
  UNITEDHEALTH: "UNH",
  MEDTRONIC: "MDT",
  STRYKER: "SYK"
};

const customAssetNames = {
  "^NDX": "Nasdaq 100",
  "^GSPC": "S&P 500",
  "^DJI": "Dow Jones Industrial Average",
  "^RUT": "Russell 2000",
  "^VIX": "CBOE Volatility Index",
  "^GDAXI": "DAX 40",
  "^FTSE": "FTSE 100",
  "^N225": "Nikkei 225",
  "^HSI": "Hang Seng Index"
};

const voiceSessionKnowledge = {
  kuwait: { name: "بورصة الكويت", type: "regular", timeZone: "Asia/Kuwait", label: "الكويت", days: [0, 1, 2, 3, 4], open: "09:00", close: "13:15" },
  saudi: { name: "بورصة السعودية", type: "regular", timeZone: "Asia/Riyadh", label: "الرياض", days: [0, 1, 2, 3, 4], open: "10:00", close: "15:00" },
  uae: { name: "أسواق الإمارات", type: "regular", timeZone: "Asia/Dubai", label: "دبي", days: [1, 2, 3, 4, 5], open: "10:00", close: "15:00" },
  qatar: { name: "بورصة قطر", type: "regular", timeZone: "Asia/Qatar", label: "الدوحة", days: [0, 1, 2, 3, 4], open: "09:30", close: "13:15" },
  bahrain: { name: "بورصة البحرين", type: "regular", timeZone: "Asia/Bahrain", label: "البحرين", days: [0, 1, 2, 3, 4], open: "09:30", close: "13:00" },
  oman: { name: "بورصة عمان", type: "regular", timeZone: "Asia/Muscat", label: "مسقط", days: [0, 1, 2, 3, 4], open: "10:00", close: "14:00" },
  us: { name: "السوق الأمريكي", type: "regular", timeZone: "America/New_York", label: "نيويورك", days: [1, 2, 3, 4, 5], open: "09:30", close: "16:00" },
  forex: { name: "سوق الفوركس", type: "weekly", timeZone: "America/New_York", label: "نيويورك", openDay: 0, open: "17:00", closeDay: 5, close: "17:00" },
  crypto: { name: "سوق العملات الرقمية", type: "always", timeZone: "UTC", label: "UTC" },
  commodities: { name: "الذهب والفضة والنفط", type: "weekly", timeZone: "America/New_York", label: "نيويورك", openDay: 0, open: "18:00", closeDay: 5, close: "17:00" },
  healthcare: { name: "أسهم الرعاية الصحية والطب", type: "regular", timeZone: "America/New_York", label: "نيويورك", days: [1, 2, 3, 4, 5], open: "09:30", close: "16:00" }
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (url.pathname === "/api/markets") {
      return sendJson(response, {
        markets: getMarketSummaries(),
        disclaimer: "هذه تحليلات آلية تعليمية وليست نصيحة مالية. تحقق من البيانات ومخاطر التداول قبل أي قرار."
      });
    }

    if (url.pathname === "/api/recommendations") {
      const marketId = url.searchParams.get("market") || "us";
      return await handleRecommendations(response, marketId);
    }

    if (url.pathname === "/api/economic-calendar") {
      const marketId = url.searchParams.get("market") || "us";
      const market = markets[marketId];
      const symbols = market?.symbols?.map((asset) => asset.symbol) || [];
      return sendJson(response, await getEconomicCalendarForMarket(marketId, symbols));
    }

    if (url.pathname === "/api/watchlist") {
      const symbols = (url.searchParams.get("symbols") || "")
        .split(",")
        .map(normalizeInputSymbol)
        .filter(Boolean)
        .slice(0, 30);
      return await handleWatchlist(response, symbols);
    }

    if (url.pathname === "/api/followed-trades") {
      return await handleFollowedTrades(request, response);
    }

    if (url.pathname === "/api/notifications") {
      return await handleNotifications(request, response);
    }

    if (url.pathname === "/api/asset") {
      const symbol = normalizeInputSymbol(url.searchParams.get("symbol") || "");
      return await handleAssetDetail(response, symbol);
    }

    if (url.pathname === "/api/ollama-status") {
      return await handleOllamaStatus(response);
    }

    if (url.pathname === "/api/voice-command" && request.method === "POST") {
      const payload = await readJsonBody(request);
      return await handleVoiceCommand(response, payload);
    }

    return await serveStatic(response, url.pathname);
  } catch (error) {
    return sendJson(response, { error: error.message || "حدث خطأ غير متوقع" }, 500);
  }
});

startServer(preferredPort);

function startServer(port, attempt = 0) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && attempt < 20) {
      const nextPort = port + 1;
      console.log(`Port ${port} is busy. Trying http://localhost:${nextPort}`);
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error(error);
    process.exitCode = 1;
  });

  server.listen(port, () => {
    console.log(`the-sfm trader is running on http://localhost:${port}`);
  });
}

async function handleRecommendations(response, marketId) {
  const market = markets[marketId];

  if (!market) {
    return sendJson(response, { error: "السوق غير معروف" }, 404);
  }

  const cacheKey = `market:${marketId}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    return sendJson(response, { ...finalizeRecommendationsPayloadForSession(cached.payload, marketId), cached: true });
  }

  if (cached && Date.now() - cached.createdAt < STALE_CACHE_TTL_MS) {
    refreshMarketCache(cacheKey, marketId, market);
    return sendJson(response, { ...finalizeRecommendationsPayloadForSession(cached.payload, marketId), cached: true, stale: true, refreshing: true });
  }

  const economicCalendar = await getEconomicCalendarForMarket(marketId, market.symbols.map((asset) => asset.symbol));
  const job = createAnalyzeAssetsJob(market.symbols, getAnalysisConcurrency(market.symbols.length), { fast: true });
  const completed = await waitForPromise(job.done, FIRST_RESPONSE_BUDGET_MS);
  const settled = completed ? await job.done : job.results.slice();
  const payload = buildRecommendationsPayload(marketId, market, settled, {
    partial: !completed,
    analyzedCount: job.completed,
    economicCalendar
  });

  if (completed) {
    cache.set(cacheKey, { createdAt: Date.now(), payload });
  } else {
    cache.set(cacheKey, { createdAt: Date.now(), payload });
    completeMarketJobInBackground(cacheKey, marketId, market, job, economicCalendar);
  }

  return sendJson(response, finalizeRecommendationsPayloadForSession(payload, marketId));
}

function buildRecommendationsPayload(marketId, market, settled = [], options = {}) {
  const rawRecommendations = [];
  const unavailable = [];

  settled.forEach((result, index) => {
    if (!result) return;
    const asset = market.symbols[index];
    if (result.status === "fulfilled") {
      rawRecommendations.push(result.value);
    } else {
      unavailable.push({
        symbol: asset.symbol,
        name: asset.name,
        reason: result.reason?.message || "تعذر التحليل"
      });
    }
  });

  const economicCalendar = options.economicCalendar || null;
  const recommendations = applyEconomicNewsOverlayToRecommendations(rawRecommendations, marketId, economicCalendar);

  recommendations.sort((a, b) => {
    const priority = { buy: 0, sell: 1, hold: 2 };
    return priority[a.action] - priority[b.action] || b.confidence - a.confidence;
  });

  return {
    market: {
      id: marketId,
      label: market.label,
      region: market.region,
      note: market.note,
      currency: market.currency,
      totalSymbols: market.symbols.length,
      supportedSymbols: market.symbols.map((asset) => ({
        symbol: asset.symbol,
        name: asset.name,
        currency: resolveCurrencyForAsset(asset, marketId)
      }))
    },
    recommendations,
    opportunityRadar: buildOpportunityRadar(recommendations),
    smartAlerts: buildSmartAlerts(recommendations),
    backtestSummary: buildBacktestSummary(recommendations),
    economicCalendar,
    unavailable,
    partial: Boolean(options.partial),
    analyzedCount: Number(options.analyzedCount || recommendations.length + unavailable.length),
    pendingCount: Math.max(0, market.symbols.length - Number(options.analyzedCount || recommendations.length + unavailable.length)),
    generatedAt: new Date().toISOString(),
    dataProvider: {
      active: getConfiguredProvider(),
      requested: process.env.DATA_PROVIDER || "yahoo",
      fallback: "yahoo"
    },
    refreshPolicy: {
      uiRefreshMs: UI_RECOMMENDATION_REFRESH_MS,
      dataCacheMs: CACHE_TTL_MS,
      staleCacheMs: STALE_CACHE_TTL_MS,
      firstResponseBudgetMs: FIRST_RESPONSE_BUDGET_MS,
      note: "الواجهة تعرض أول نتيجة سريعة ثم يكمل السيرفر التحليل بالخلفية."
    },
    disclaimer: "ليست نصيحة مالية. النموذج يعتمد على مؤشرات فنية بسيطة وبيانات مجانية قد تكون متأخرة أو ناقصة."
  };
}

function finalizeRecommendationsPayloadForSession(payload, marketId) {
  const session = getExecutionSessionState(marketId);
  const marketWideSession = session && !isAggregateMarket(marketId);
  const closed = marketWideSession && session.isOpen === false;
  const recommendations = (payload.recommendations || []).map((item) => (
    finalizeRecommendationForExecutionSession(normalizeRecommendationCurrency(item, marketId), marketId, session)
  ));
  const note = closed
    ? `${payload.market?.note || ""} السوق مغلق الآن؛ الإشارات المعروضة للمراقبة وليست أوامر دخول فورية.`
    : payload.market?.note;
  const disclaimer = closed
    ? `${payload.disclaimer || ""} وقت إغلاق السوق لا تنفذ شراء أو بيع حتى يعود التداول وتظهر أسعار حية.`
    : payload.disclaimer;

  return {
    ...payload,
    market: {
      ...(payload.market || {}),
      session,
      note
    },
    recommendations,
    opportunityRadar: buildOpportunityRadar(recommendations),
    smartAlerts: buildSmartAlerts(recommendations),
    backtestSummary: buildBacktestSummary(recommendations),
    disclaimer
  };
}

function finalizeRecommendationForExecutionSession(item, marketId, marketSession) {
  const aggregate = isAggregateMarket(marketId);
  const executionMarketId = aggregate ? resolveSymbolExecutionMarketId(item.symbol, marketId) : marketId;
  const session = aggregate ? getExecutionSessionState(executionMarketId) : marketSession;
  const enriched = {
    ...item,
    currency: resolveCurrencyForAsset(item, executionMarketId),
    executionMarketId,
    executionSession: session || null
  };

  if (session?.isOpen === false) {
    return applyClosedMarketGuard(enriched, session);
  }

  return enriched;
}

function normalizeRecommendationCurrency(item = {}, marketId = "") {
  return {
    ...item,
    currency: resolveCurrencyForAsset(item, marketId)
  };
}

function normalizeCurrencyCode(currency) {
  const code = String(currency || "").trim().toUpperCase();
  return {
    PAIR: "PAIR",
    MIXED: "MIXED",
    GCC: "GCC",
    KWF: "KWD",
    KW: "KWD",
    KWD: "KWD",
    SAR: "SAR",
    AED: "AED",
    QAR: "QAR",
    BHD: "BHD",
    OMR: "OMR",
    USD: "USD",
    EUR: "EUR"
  }[code] || code;
}

function resolveCurrencyForAsset(asset = {}, marketId = "") {
  const symbolCurrency = inferCurrencyFromSymbol(asset.symbol);
  const providerCurrency = normalizeCurrencyCode(asset.currency);
  const marketCurrency = inferCurrencyFromMarketId(marketId);

  if (symbolCurrency) return symbolCurrency;
  if (providerCurrency && !["GCC", "MIXED"].includes(providerCurrency)) return providerCurrency;
  if (marketCurrency && !["GCC", "MIXED"].includes(marketCurrency)) return marketCurrency;
  return "USD";
}

function inferCurrencyFromMarketId(marketId) {
  const id = String(marketId || "").toLowerCase();
  if (!id) return "";
  if (id.includes("kuwait") || id.includes("bourse-kuwait")) return "KWD";
  if (id.includes("saudi") || id.includes("tadawul")) return "SAR";
  if (id.includes("uae") || id.includes("dubai") || id.includes("adx") || id.includes("dfm")) return "AED";
  if (id.includes("qatar")) return "QAR";
  if (id.includes("bahrain")) return "BHD";
  if (id.includes("oman") || id.includes("muscat")) return "OMR";
  if (id.includes("forex") || id.includes("fx") || id.includes("currency")) return "PAIR";
  if (id.includes("crypto")) return "USD";
  if (id.includes("commodity") || id.includes("commodities") || id.includes("energy")) return "USD";
  if (id.includes("us") || id.includes("technology") || id.includes("food") || id.includes("pharmaceutical") || id.includes("banking") || id.includes("ai") || id.includes("semiconductor")) return "USD";
  if (id.includes("europe")) return "EUR";
  if (id.includes("asia") || id.includes("asian")) return "MIXED";
  return "";
}

function inferCurrencyFromSymbol(symbol) {
  const upper = String(symbol || "").toUpperCase();
  if (upper.endsWith("=X")) return "PAIR";
  if (upper.includes("-USD")) return "USD";
  if (upper.endsWith("=F")) return "USD";
  if (upper.endsWith(".KW")) return "KWD";
  if (upper.endsWith(".SR")) return "SAR";
  if (upper.endsWith(".AE") || upper.endsWith(".AD") || upper.endsWith(".DU")) return "AED";
  if (upper.endsWith(".QA")) return "QAR";
  if (upper.endsWith(".BH")) return "BHD";
  if (upper.endsWith(".OM")) return "OMR";
  if (upper.endsWith(".AS") || upper.endsWith(".DE") || upper.endsWith(".PA") || upper.endsWith(".SW") || upper.endsWith(".L")) return "EUR";
  if (upper.startsWith("^") || /^[A-Z]{1,5}$/.test(upper)) return "USD";
  return "";
}

function applyClosedMarketGuard(item, session) {
  const reasons = Array.isArray(item.reasons) ? item.reasons : [];
  const nextOpen = session.openAt ? new Date(session.openAt).toLocaleString("ar-KW-u-nu-latn", {
    timeZone: session.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    day: "2-digit",
    month: "2-digit"
  }) : "";

  return {
    ...item,
    setupAction: item.action,
    setupActionLabel: item.actionLabel,
    action: "hold",
    actionLabel: "انتظار",
    confidence: Math.min(Number(item.confidence) || 0, 62),
    duration: session.openAt ? `مراقبة حتى افتتاح السوق: ${nextOpen} بتوقيت ${session.label}` : "مراقبة حتى افتتاح السوق",
    marketClosed: true,
    marketSession: session,
    reasons: [
      `السوق مغلق الآن؛ لا توجد توصية دخول فورية قبل عودة التداول.`,
      ...reasons.filter(Boolean)
    ].slice(0, 6),
    decision: item.decision
      ? {
          ...item.decision,
          badge: "انتظار",
          summary: "السوق مغلق الآن؛ راقب الإشارة عند الافتتاح ولا تدخل قبل ظهور أسعار حية."
        }
      : item.decision
  };
}

function getExecutionSessionState(marketId, now = new Date()) {
  const config = getExecutionSessionConfig(marketId);
  if (!config) return null;

  if (config.type === "always") {
    return {
      isOpen: true,
      type: config.type,
      label: config.label,
      timeZone: config.timeZone,
      statusLabel: "السوق مفتوح",
      eventLabel: "مفتوح دائماً",
      countdownMs: 0
    };
  }

  const state = getVoiceSessionState(config, now);
  const eventDate = state.isOpen ? state.closeAt : state.openAt;
  return {
    isOpen: state.isOpen,
    type: config.type,
    label: config.label,
    timeZone: config.timeZone,
    statusLabel: state.isOpen ? "السوق مفتوح" : "السوق مغلق",
    eventLabel: state.isOpen ? "يغلق بعد" : "يفتح بعد",
    countdownMs: Math.max(0, eventDate - now),
    openAt: state.openAt ? state.openAt.toISOString() : null,
    closeAt: state.closeAt ? state.closeAt.toISOString() : null
  };
}

function getExecutionSessionConfig(marketId) {
  if (voiceSessionKnowledge[marketId]) return voiceSessionKnowledge[marketId];

  const aliases = {
    ai: "us",
    tech: "us",
    dividends: "us",
    healthcare: "healthcare",
    commodities: "commodities",
    food: "commodities",
    crypto: "crypto"
  };
  const alias = aliases[marketId];
  return alias ? voiceSessionKnowledge[alias] : null;
}

function isAggregateMarket(marketId) {
  return aggregateMarketIds.has(marketId);
}

function resolveSymbolExecutionMarketId(symbol, fallbackMarketId = "") {
  const clean = String(symbol || "").trim().toUpperCase();
  if (!clean) return fallbackMarketId;
  if (symbolExecutionMarketCache.has(clean)) return symbolExecutionMarketCache.get(clean);

  for (const marketId of canonicalMarketPriority) {
    const marketSymbols = markets[marketId]?.symbols || [];
    if (marketSymbols.some((asset) => String(asset.symbol || "").trim().toUpperCase() === clean)) {
      symbolExecutionMarketCache.set(clean, marketId);
      return marketId;
    }
  }

  const inferred = inferExecutionMarketFromSymbol(clean) || fallbackMarketId;
  symbolExecutionMarketCache.set(clean, inferred);
  return inferred;
}

function inferExecutionMarketFromSymbol(symbol) {
  if (symbol.endsWith(".KW")) return "kuwait";
  if (symbol.endsWith(".SR")) return "saudi";
  if (symbol.endsWith(".AE") || symbol.endsWith(".AD") || symbol.endsWith(".DU")) return "uae";
  if (symbol.endsWith(".QA")) return "qatar";
  if (symbol.endsWith(".BH")) return "bahrain";
  if (symbol.endsWith(".OM")) return "oman";
  if (/^[A-Z]{6}=X$/.test(symbol)) return "forex";
  if (symbol.endsWith("-USD")) return "crypto";
  if (["GC=F", "SI=F", "CL=F", "BZ=F", "NG=F", "HG=F", "KC=F", "CC=F"].includes(symbol)) return "commodities";
  if (symbol.startsWith("^") || /^[A-Z]{1,5}$/.test(symbol)) return "us";
  return "";
}

function refreshMarketCache(cacheKey, marketId, market) {
  const refreshKey = `${cacheKey}:refreshing`;
  if (cache.get(refreshKey)) return;

  cache.set(refreshKey, { createdAt: Date.now(), payload: true });
  const job = createAnalyzeAssetsJob(market.symbols, getAnalysisConcurrency(market.symbols.length), { fast: true });
  Promise.all([
    job.done,
    getEconomicCalendarForMarket(marketId, market.symbols.map((asset) => asset.symbol))
  ]).then(([settled, economicCalendar]) => {
    const payload = buildRecommendationsPayload(marketId, market, settled, { economicCalendar });
    cache.set(cacheKey, { createdAt: Date.now(), payload });
  }).catch(() => {
    // الخلفية اختيارية؛ إذا فشلت يبقى الكاش القديم متاحاً للمستخدم.
  }).finally(() => {
    cache.delete(refreshKey);
  });
}

function completeMarketJobInBackground(cacheKey, marketId, market, job, economicCalendar) {
  const refreshKey = `${cacheKey}:completing`;
  if (cache.get(refreshKey)) return;

  cache.set(refreshKey, { createdAt: Date.now(), payload: true });
  job.done.then((settled) => {
    const payload = buildRecommendationsPayload(marketId, market, settled, { economicCalendar });
    cache.set(cacheKey, { createdAt: Date.now(), payload });
  }).catch(() => {
    // Keep the first fast response if the background completion fails.
  }).finally(() => {
    cache.delete(refreshKey);
  });
}

async function handleWatchlist(response, symbols) {
  const uniqueSymbols = [...new Set(symbols)];

  if (!uniqueSymbols.length) {
    const economicCalendar = await getEconomicCalendarForMarket("watchlist", []);
    return sendJson(response, {
      market: {
        id: "watchlist",
        label: "Watchlist",
        region: "Custom",
        note: "أضف رموزاً لمراقبتها.",
        totalSymbols: 0,
        supportedSymbols: []
      },
      recommendations: [],
      smartAlerts: [],
      backtestSummary: buildBacktestSummary([]),
      economicCalendar,
      unavailable: [],
      generatedAt: new Date().toISOString(),
      dataProvider: {
        active: getConfiguredProvider(),
        requested: process.env.DATA_PROVIDER || "yahoo",
        fallback: "yahoo"
      },
      disclaimer: "ليست نصيحة مالية. هذه مراقبة مخصصة للرموز التي أضفتها."
    });
  }

  const cacheKey = `watchlist:${uniqueSymbols.sort().join(",")}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    return sendJson(response, { ...cached.payload, cached: true });
  }

  if (cached && Date.now() - cached.createdAt < STALE_CACHE_TTL_MS) {
    refreshWatchlistCache(cacheKey, uniqueSymbols);
    return sendJson(response, { ...cached.payload, cached: true, stale: true, refreshing: true });
  }

  const assets = uniqueSymbols.map(resolveAsset);
  const economicCalendar = await getEconomicCalendarForMarket("watchlist", assets.map((asset) => asset.symbol));
  const job = createAnalyzeAssetsJob(assets, getAnalysisConcurrency(assets.length), { fast: true });
  const completed = await waitForPromise(job.done, FIRST_RESPONSE_BUDGET_MS);
  const settled = completed ? await job.done : job.results.slice();
  const payload = buildWatchlistPayload(assets, settled, {
    partial: !completed,
    analyzedCount: job.completed,
    economicCalendar
  });

  if (completed) {
    cache.set(cacheKey, { createdAt: Date.now(), payload });
  } else {
    cache.set(cacheKey, { createdAt: Date.now(), payload });
    completeWatchlistJobInBackground(cacheKey, assets, job, economicCalendar);
  }

  return sendJson(response, payload);
}

function buildWatchlistPayload(assets, settled = [], options = {}) {
  const rawRecommendations = [];
  const unavailable = [];

  settled.forEach((result, index) => {
    if (!result) return;
    const asset = assets[index];
    if (result.status === "fulfilled") {
      rawRecommendations.push(result.value);
    } else {
      unavailable.push({
        symbol: asset.symbol,
        name: asset.name,
        reason: result.reason?.message || "تعذر التحليل"
      });
    }
  });

  const economicCalendar = options.economicCalendar || null;
  const recommendations = applyEconomicNewsOverlayToRecommendations(rawRecommendations, "watchlist", economicCalendar)
    .map((item) => normalizeRecommendationCurrency(item, resolveSymbolExecutionMarketId(item.symbol, "watchlist")));

  recommendations.sort((a, b) => b.confidence - a.confidence || Math.abs(b.expectedMovePct) - Math.abs(a.expectedMovePct));

  return {
    market: {
      id: "watchlist",
      label: "Watchlist",
      region: "Custom",
      note: "قائمة مراقبة مخصصة تحفظ داخل المتصفح.",
      totalSymbols: assets.length,
      supportedSymbols: assets.map((asset) => ({
        symbol: asset.symbol,
        name: asset.name,
        currency: resolveCurrencyForAsset(asset, resolveSymbolExecutionMarketId(asset.symbol, "watchlist"))
      }))
    },
    recommendations,
    opportunityRadar: buildOpportunityRadar(recommendations),
    smartAlerts: buildSmartAlerts(recommendations),
    backtestSummary: buildBacktestSummary(recommendations),
    economicCalendar,
    unavailable,
    partial: Boolean(options.partial),
    analyzedCount: Number(options.analyzedCount || recommendations.length + unavailable.length),
    pendingCount: Math.max(0, assets.length - Number(options.analyzedCount || recommendations.length + unavailable.length)),
    generatedAt: new Date().toISOString(),
    dataProvider: {
      active: getConfiguredProvider(),
      requested: process.env.DATA_PROVIDER || "yahoo",
      fallback: "yahoo"
    },
    disclaimer: "ليست نصيحة مالية. هذه مراقبة مخصصة للرموز التي أضفتها."
  };
}

function refreshWatchlistCache(cacheKey, symbols) {
  const refreshKey = `${cacheKey}:refreshing`;
  if (cache.get(refreshKey)) return;

  const assets = symbols.map(resolveAsset);
  cache.set(refreshKey, { createdAt: Date.now(), payload: true });
  const job = createAnalyzeAssetsJob(assets, getAnalysisConcurrency(assets.length), { fast: true });
  Promise.all([
    job.done,
    getEconomicCalendarForMarket("watchlist", assets.map((asset) => asset.symbol))
  ]).then(([settled, economicCalendar]) => {
    cache.set(cacheKey, { createdAt: Date.now(), payload: buildWatchlistPayload(assets, settled, { economicCalendar }) });
  }).catch(() => {
    // تحديث الخلفية اختياري.
  }).finally(() => {
    cache.delete(refreshKey);
  });
}

function completeWatchlistJobInBackground(cacheKey, assets, job, economicCalendar) {
  const refreshKey = `${cacheKey}:completing`;
  if (cache.get(refreshKey)) return;

  cache.set(refreshKey, { createdAt: Date.now(), payload: true });
  job.done.then((settled) => {
    cache.set(cacheKey, {
      createdAt: Date.now(),
      payload: buildWatchlistPayload(assets, settled, { economicCalendar })
    });
  }).catch(() => {
    // Keep the first fast response if the background completion fails.
  }).finally(() => {
    cache.delete(refreshKey);
  });
}

async function handleFollowedTrades(request, response) {
  if (request.method === "GET") {
    return sendJson(response, await readSharedTradeState());
  }

  if (request.method !== "POST") {
    return sendJson(response, { error: "Method not allowed" }, 405);
  }

  const payload = await readJsonBody(request);
  const state = normalizeSharedTradeState(payload);
  await writeSharedTradeState(state);
  return sendJson(response, state);
}

async function readSharedTradeState() {
  try {
    const raw = await readFile(sharedStatePath, "utf8");
    return normalizeSharedTradeState(JSON.parse(raw));
  } catch {
    return normalizeSharedTradeState({});
  }
}

async function writeSharedTradeState(state) {
  const normalized = normalizeSharedTradeState(state);
  await writeFile(sharedStatePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

function normalizeSharedTradeState(payload = {}) {
  const entries = normalizeSharedTradeEntries(payload.followedEntries || payload.entries || []);
  const removedKeys = uniqueStrings(payload.removedFollowedTradeKeys || payload.removedKeys || [], 240);
  const removedSet = new Set(removedKeys);
  const keys = uniqueStrings([
    ...(payload.followedTradeKeys || payload.keys || []),
    ...entries.map((entry) => entry.key)
  ], 120).filter((key) => !removedSet.has(key));
  const alerts = uniqueStrings(payload.followedTradeAlerts || payload.alerts || [], 160)
    .filter((alertKey) => !isSharedAlertForRemovedTrade(alertKey, removedSet));

  return {
    followedTradeKeys: keys,
    followedEntries: entries.filter((entry) => keys.includes(entry.key) && !removedSet.has(entry.key)),
    followedTradeAlerts: alerts,
    removedFollowedTradeKeys: removedKeys,
    updatedAt: new Date().toISOString()
  };
}

function isSharedAlertForRemovedTrade(alertKey, removedSet) {
  for (const key of removedSet) {
    if (String(alertKey || "").startsWith(`${key}:`)) return true;
  }
  return false;
}

function normalizeSharedTradeEntries(entries) {
  const byKey = new Map();

  for (const rawEntry of Array.isArray(entries) ? entries : []) {
    const entry = sanitizeSharedTradeEntry(rawEntry);
    if (!entry) continue;

    const existing = byKey.get(entry.key);
    if (!existing || new Date(entry.lastSeen || 0) >= new Date(existing.lastSeen || 0)) {
      byKey.set(entry.key, entry);
    }
  }

  return [...byKey.values()]
    .sort((a, b) => new Date(b.lastSeen || 0) - new Date(a.lastSeen || 0))
    .slice(0, 120);
}

function sanitizeSharedTradeEntry(entry) {
  if (!entry || typeof entry !== "object") return null;

  const key = String(entry.key || "").slice(0, 90);
  const symbol = normalizeInputSymbol(entry.symbol || key.split(":")[0]);
  if (!key || !symbol) return null;

  return {
    key,
    symbol,
    name: String(entry.name || symbol).slice(0, 120),
    action: ["buy", "sell", "hold"].includes(entry.action) ? entry.action : "hold",
    actionLabel: String(entry.actionLabel || "").slice(0, 32),
    currentPrice: toNullableNumber(entry.currentPrice),
    lastPrice: toNullableNumber(entry.lastPrice ?? entry.currentPrice),
    expectedPrice: toNullableNumber(entry.expectedPrice),
    target1: toNullableNumber(entry.target1),
    target2: toNullableNumber(entry.target2),
    stopLoss: toNullableNumber(entry.stopLoss),
    currency: String(entry.currency || "USD").slice(0, 8),
    confidence: toNullableNumber(entry.confidence),
    expectedMovePct: toNullableNumber(entry.expectedMovePct),
    riskReward: toNullableNumber(entry.riskReward),
    analysisQuality: toNullableNumber(entry.analysisQuality),
    firstSeen: normalizeIsoDate(entry.firstSeen),
    lastSeen: normalizeIsoDate(entry.lastSeen),
    targetHit: Boolean(entry.targetHit),
    stopHit: Boolean(entry.stopHit),
    outcome: ["pending", "target", "stop"].includes(entry.outcome) ? entry.outcome : "pending",
    hitAt: entry.hitAt ? normalizeIsoDate(entry.hitAt) : null,
    stopAt: entry.stopAt ? normalizeIsoDate(entry.stopAt) : null,
    observedReturnPct: toNullableNumber(entry.observedReturnPct),
    bestPrice: toNullableNumber(entry.bestPrice),
    worstPrice: toNullableNumber(entry.worstPrice)
  };
}

function uniqueStrings(values, limit) {
  return [...new Set((Array.isArray(values) ? values : []).map((value) => String(value || "").slice(0, 120)).filter(Boolean))].slice(0, limit);
}

function toNullableNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeIsoDate(value) {
  const date = new Date(value || Date.now());
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

async function handleNotifications(request, response) {
  if (request.method === "GET") {
    return sendJson(response, await readNotificationLog());
  }

  if (request.method === "DELETE") {
    const cleared = { notifications: [], updatedAt: new Date().toISOString() };
    await writeNotificationLog(cleared.notifications);
    return sendJson(response, cleared);
  }

  if (request.method !== "POST") {
    return sendJson(response, { error: "Method not allowed" }, 405);
  }

  const payload = await readJsonBody(request);
  const notifications = normalizeNotificationLog(payload.notifications || []);
  await writeNotificationLog(notifications);
  return sendJson(response, {
    notifications,
    updatedAt: new Date().toISOString()
  });
}

async function readNotificationLog() {
  try {
    const raw = await readFile(notificationLogPath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      notifications: normalizeNotificationLog(parsed.notifications || []),
      updatedAt: parsed.updatedAt || new Date().toISOString()
    };
  } catch {
    return {
      notifications: [],
      updatedAt: new Date().toISOString()
    };
  }
}

async function writeNotificationLog(notifications) {
  const payload = {
    notifications: normalizeNotificationLog(notifications),
    updatedAt: new Date().toISOString()
  };
  await writeFile(notificationLogPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return payload;
}

function normalizeNotificationLog(notifications) {
  const byId = new Map();

  for (const rawNotification of Array.isArray(notifications) ? notifications : []) {
    const notification = sanitizeNotificationEntry(rawNotification);
    if (!notification) continue;

    const existing = byId.get(notification.id);
    if (!existing || new Date(notification.createdAt) >= new Date(existing.createdAt)) {
      byId.set(notification.id, notification);
    }
  }

  return [...byId.values()]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 200);
}

function sanitizeNotificationEntry(notification) {
  if (!notification || typeof notification !== "object") return null;

  const title = String(notification.title || "").trim().slice(0, 140);
  const message = String(notification.message || "").trim().slice(0, 360);
  if (!title && !message) return null;

  const id = String(notification.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`).slice(0, 80);

  return {
    id,
    title: title || "SFM",
    message,
    type: String(notification.type || "system").slice(0, 32),
    createdAt: normalizeIsoDate(notification.createdAt),
    read: Boolean(notification.read)
  };
}

async function handleAssetDetail(response, symbol) {
  if (!symbol) {
    return sendJson(response, { error: "الرمز مطلوب" }, 400);
  }

  const payload = await getAssetDetailPayload(symbol);
  return sendJson(response, payload);
}

async function getAssetDetailPayload(symbol) {
  const cacheKey = `asset:${symbol}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    return { ...cached.payload, cached: true };
  }

  const asset = resolveAsset(symbol);
  const market = findMarketForAsset(asset.symbol);
  const recommendation = await analyzeSymbol(await enrichShariaAsset(asset));
  const profile = buildAssetProfile(asset, market, recommendation);
  const payload = {
    asset: {
      symbol: recommendation.symbol,
      name: recommendation.name,
      exchangeName: recommendation.exchangeName,
      currency: recommendation.currency,
      marketState: recommendation.marketState,
      providerDelayNote: recommendation.providerDelayNote
    },
    market,
    profile,
    recommendation,
    generatedAt: new Date().toISOString(),
    dataProvider: {
      active: getConfiguredProvider(),
      requested: process.env.DATA_PROVIDER || "yahoo",
      fallback: "yahoo"
    },
    disclaimer: "ليست نصيحة مالية. هذه قراءة آلية تعليمية تجمع عدة فريمات ومؤشرات، وتحتاج مراجعة شخصية قبل أي قرار."
  };

  cache.set(cacheKey, { createdAt: Date.now(), payload });
  return payload;
}

async function handleVoiceCommand(response, payload) {
  const transcript = String(payload?.transcript || "").trim().slice(0, 800);
  if (!transcript) {
    return sendJson(response, { error: "النص الصوتي مطلوب" }, 400);
  }
  const language = payload?.language === "en" ? "en" : "ar";

  const sessionReply = getVoiceMarketSessionReply(transcript);
  if (sessionReply) {
    return sendJson(response, {
      ...sessionReply,
      aiEngine: "local",
      language,
      transcript,
      generatedAt: new Date().toISOString()
    });
  }

  const activeMarket = String(payload?.activeMarket || "");
  const requestedMarket = resolveVoiceMarketId(transcript) || activeMarket;
  const rawRecommendations = summarizeVoiceRecommendations(payload?.recommendations || []);
  const recommendations = await getVoiceRecommendationsForTranscript(transcript, requestedMarket, rawRecommendations, activeMarket);

  const voicePayload = {
    transcript,
    language,
    activeMarket: requestedMarket,
    recommendations
  };

  const pythonResult = await runPythonVoiceAgent(voicePayload);
  const aiResult = isUsefulVoiceResult(pythonResult)
    ? pythonResult
    : ((await runOllamaVoiceAgent(voicePayload)) || pythonResult);
  const localFallback = buildSessionAwareVoiceFallback(transcript, requestedMarket, recommendations, language);
  const agentResult = isUsefulVoiceResult(aiResult) ? aiResult : (localFallback || aiResult);
  const result = {
    ...agentResult,
    aiEngine: agentResult.aiEngine || "python",
    language,
    marketId: requestedMarket,
    transcript,
    generatedAt: new Date().toISOString()
  };

  if (agentResult.symbol && agentResult.intent === "asset_lookup") {
    const symbol = normalizeInputSymbol(agentResult.symbol);
    const detail = await getAssetDetailPayload(symbol);
    result.symbol = detail.asset.symbol;
    result.detailUrl = `/detail.html?symbol=${encodeURIComponent(detail.asset.symbol)}`;
    result.watchSymbol = detail.asset.symbol;
    result.reply = buildAssetVoiceReply(detail.recommendation, detail.profile, Boolean(agentResult.monitor));
  }

  return sendJson(response, result);
}

function buildSessionAwareVoiceFallback(transcript, marketId, recommendations = [], language = "ar") {
  const text = String(transcript || "").toLowerCase().normalize("NFC");
  const wantsSell = includesAnyText(text, [
    "\u0628\u064a\u0639",
    "\u0627\u0628\u064a\u0639",
    "\u0623\u0628\u064a\u0639",
    "\u0627\u062e\u0631\u062c"
  ]) || /sell/i.test(text);
  const wantsBuy = includesAnyText(text, [
    "\u0627\u0641\u0636\u0644",
    "\u0623\u0641\u0636\u0644",
    "\u0627\u0642\u0648\u0649",
    "\u0623\u0642\u0648\u0649",
    "\u0627\u0634\u062a\u0631\u064a",
    "\u0623\u0634\u062a\u0631\u064a",
    "\u0634\u0631\u0627\u0621",
    "\u0641\u0631\u0635\u0647",
    "\u0641\u0631\u0635\u0629",
    "\u062a\u0631\u0634\u062d"
  ]) || /buy|best/i.test(text);

  const session = getExecutionSessionState(marketId);
  const marketName = markets[marketId]?.label || "السوق";
  const intent = wantsSell ? "best_sell" : "best_buy";
  const english = language === "en";

  if (!wantsBuy && !wantsSell && (!session || session.isOpen)) return null;

  if (session && !session.isOpen) {
    const openText = session.openAt
      ? new Date(session.openAt).toLocaleString(english ? "en-US" : "ar-KW-u-nu-latn", {
          timeZone: session.timeZone,
          weekday: "long",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        })
      : "";
    return {
      intent,
      reply: english
        ? `${marketName} is closed now. I will not give a live buy or sell order before the market opens. Next open: ${openText} ${session.label}. Watch only and wait for live prices.`
        : `${marketName} مغلق الآن. ما أعطيك أمر شراء أو بيع مباشر قبل افتتاح السوق. الافتتاح القادم ${openText} بتوقيت ${session.label}. حالياً مراقبة فقط وانتظر الأسعار الحية.`,
      aiEngine: "local-session"
    };
  }

  const candidates = recommendations
    .filter((item) => item.action === (wantsSell ? "sell" : "buy"))
    .sort((a, b) => Number(b.confidence || 0) - Number(a.confidence || 0));
  const item = candidates[0];
  if (!item) {
    return {
      intent,
      reply: english
        ? `${marketName}: I do not see a clear ${wantsSell ? "sell" : "buy"} signal now. Wait for a cleaner setup.`
        : `${marketName}: ما عندي إشارة ${wantsSell ? "بيع" : "شراء"} واضحة حالياً. الأفضل الانتظار لين تتضح الفرصة.`,
      aiEngine: "local-session"
    };
  }

  return {
    intent,
    symbol: item.symbol,
    reply: english
      ? `${marketName}: strongest ${wantsSell ? "sell" : "buy"} setup is ${item.name || item.symbol} (${item.symbol}) with ${item.confidence}% confidence. Current price ${formatVoiceMoney(item.currentPrice, item.currency)}, target ${formatVoiceMoney(item.target1 || item.expectedPrice, item.currency)}. Manage risk before any trade.`
      : `${marketName}: أقوى فرصة ${wantsSell ? "بيع" : "شراء"} هي ${item.name || item.symbol} (${item.symbol}) بثقة ${item.confidence}%. السعر ${formatVoiceMoney(item.currentPrice, item.currency)} والهدف ${formatVoiceMoney(item.target1 || item.expectedPrice, item.currency)}. راجع المخاطر قبل أي قرار.`,
    aiEngine: "local-session"
  };
}

function includesAnyText(value, needles) {
  return needles.some((needle) => value.includes(needle));
}

async function getVoiceRecommendationsForTranscript(transcript, requestedMarket, currentRecommendations, originalActiveMarket = "") {
  const clean = normalizeArabicText(transcript);
  if (requestedMarket && requestedMarket !== originalActiveMarket && markets[requestedMarket]) {
    try {
      const payload = await getMarketPayloadForVoice(requestedMarket);
      return summarizeVoiceRecommendations(payload.recommendations || []);
    } catch {
      return currentRecommendations;
    }
  }

  const asksForStock =
    clean.includes("سهم") ||
    clean.includes("اسهم") ||
    clean.includes("افضل") ||
    clean.includes("اقوي") ||
    clean.includes("اشتري") ||
    clean.includes("شراء");
  const nonStockMarket = ["forex", "crypto"].includes(requestedMarket);

  if (!asksForStock || (!nonStockMarket && currentRecommendations.length)) {
    return currentRecommendations;
  }

  try {
    const payload = await getMarketPayloadForVoice("us");
    return summarizeVoiceRecommendations(payload.recommendations || []);
  } catch {
    return currentRecommendations;
  }
}

function getVoiceMarketSessionReply(transcript) {
  const clean = normalizeArabicText(transcript);
  const hasTimingIntent = /(متى|وقت|اوقات|أوقات|كم باقي|يفتح|تفتح|فتح|يبدا|يبدأ|يصكر|تسكر|يغلق|اغلاق|إغلاق|مفتوح|مغلق|الجلسه|الجلسة)/.test(clean);
  const hasMarketContext = /(السوق|البورصه|البورصة|كويت|سعود|امارات|قطر|بحرين|عمان|امريكا|فوركس|ذهب|نفط|عملات|طبي|طبية|صحية|صحيه|ادويه|أدوية|healthcare|medical|pharma|crypto|forex|market|exchange)/.test(clean);
  const asksSession =
    hasTimingIntent && hasMarketContext;

  if (!asksSession) return null;

  if (/(كل|جميع|العالم|عالمي|world|global)/.test(clean)) {
    const summary = ["kuwait", "saudi", "uae", "qatar", "bahrain", "oman", "us", "forex", "commodities", "crypto"]
      .map((id) => formatVoiceSessionLine(voiceSessionKnowledge[id]))
      .join("، ");
    return {
      intent: "market_session",
      marketId: "world",
      reply: `أعرف أوقات الأسواق الرئيسية: ${summary}. هذه أوقات اعتيادية ولا تشمل العطل الرسمية أو المزادات الخاصة.`
    };
  }

  const marketId = resolveVoiceMarketId(transcript) || "kuwait";
  const config = voiceSessionKnowledge[marketId] || voiceSessionKnowledge.kuwait;

  if (config.type === "always") {
    return {
      intent: "market_session",
      marketId,
      reply: `${config.name} مفتوح 24 ساعة، 7 أيام في الأسبوع.`
    };
  }

  const state = getVoiceSessionState(config, new Date());
  const openLabel = formatVoiceSessionTime(config.open);
  const closeLabel = formatVoiceSessionTime(config.close);
  const daysLabel = getVoiceSessionDaysLabel(config);
  const status = state.isOpen
    ? `مفتوح الآن ويصكر بعد ${formatVoiceCountdown(state.closeAt - Date.now())}`
    : `مغلق الآن ويفتح بعد ${formatVoiceCountdown(state.openAt - Date.now())}`;

  return {
    intent: "market_session",
    marketId,
    reply: `${config.name}: يفتح ${openLabel} ويغلق ${closeLabel} بتوقيت ${config.label}، ${daysLabel}. ${status}.`
  };
}

function formatVoiceSessionLine(config) {
  if (!config) return "";
  if (config.type === "always") return `${config.name}: مفتوح 24/7`;
  if (config.type === "weekly") return `${config.name}: من ${formatVoiceSessionTime(config.open)} إلى ${formatVoiceSessionTime(config.close)} بتوقيت ${config.label}`;
  return `${config.name}: ${formatVoiceSessionTime(config.open)}-${formatVoiceSessionTime(config.close)} بتوقيت ${config.label}`;
}

function getVoiceSessionState(config, now) {
  if (config.type === "weekly") return getVoiceWeeklySessionState(config, now);
  return getVoiceRegularSessionState(config, now);
}

function getVoiceRegularSessionState(config, now) {
  const parts = getVoiceZonedParts(now, config.timeZone);
  let nextOpen = null;

  for (let offset = -1; offset <= 8; offset += 1) {
    const day = addVoiceDays(parts, offset);
    if (!config.days.includes(day.weekday)) continue;

    const openAt = makeVoiceZonedDate(day, config.open, config.timeZone);
    let closeAt = makeVoiceZonedDate(day, config.close, config.timeZone);
    if (closeAt <= openAt) closeAt = makeVoiceZonedDate(addVoiceDays(day, 1), config.close, config.timeZone);

    if (now >= openAt && now < closeAt) return { isOpen: true, openAt, closeAt };
    if (openAt > now && (!nextOpen || openAt < nextOpen)) nextOpen = openAt;
  }

  return { isOpen: false, openAt: nextOpen || now };
}

function getVoiceWeeklySessionState(config, now) {
  const parts = getVoiceZonedParts(now, config.timeZone);
  const weekStart = addVoiceDays(parts, -parts.weekday);
  let nextOpen = null;

  for (let weekOffset = -1; weekOffset <= 2; weekOffset += 1) {
    const start = addVoiceDays(weekStart, weekOffset * 7);
    const openDay = addVoiceDays(start, config.openDay);
    const closeDay = addVoiceDays(start, config.closeDay);
    const openAt = makeVoiceZonedDate(openDay, config.open, config.timeZone);
    let closeAt = makeVoiceZonedDate(closeDay, config.close, config.timeZone);
    if (closeAt <= openAt) closeAt = makeVoiceZonedDate(addVoiceDays(closeDay, 7), config.close, config.timeZone);

    if (now >= openAt && now < closeAt) return { isOpen: true, openAt, closeAt };
    if (openAt > now && (!nextOpen || openAt < nextOpen)) nextOpen = openAt;
  }

  return { isOpen: false, openAt: nextOpen || now };
}

function getVoiceZonedParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
    weekday: weekdays[values.weekday]
  };
}

function addVoiceDays(parts, days) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: date.getUTCDay()
  };
}

function makeVoiceZonedDate(day, time, timeZone) {
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = Date.UTC(day.year, day.month - 1, day.day, hour, minute, 0);
  let offset = getVoiceTimeZoneOffsetMs(new Date(utcGuess), timeZone);
  let zonedDate = new Date(utcGuess - offset);
  const adjustedOffset = getVoiceTimeZoneOffsetMs(zonedDate, timeZone);
  if (adjustedOffset !== offset) zonedDate = new Date(utcGuess - adjustedOffset);
  return zonedDate;
}

function getVoiceTimeZoneOffsetMs(date, timeZone) {
  const parts = getVoiceZonedParts(date, timeZone);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - date.getTime();
}

function getVoiceSessionDaysLabel(config) {
  if (config.type === "weekly") return "من مساء الأحد إلى مساء الجمعة";
  const dayKey = JSON.stringify(config.days || []);
  if (dayKey === JSON.stringify([0, 1, 2, 3, 4])) return "من الأحد إلى الخميس";
  if (dayKey === JSON.stringify([1, 2, 3, 4, 5])) return "من الاثنين إلى الجمعة";
  return "حسب أيام التداول المعتادة";
}

function formatVoiceSessionTime(value) {
  const [hour, minute] = value.split(":").map(Number);
  const suffix = hour >= 12 ? "م" : "ص";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function formatVoiceCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days} يوم و${hours} ساعة`;
  if (hours > 0) return `${hours} ساعة و${minutes} دقيقة`;
  return `${minutes} دقيقة`;
}

function resolveVoiceMarketId(transcript) {
  const clean = normalizeArabicText(transcript);
  const tests = [
    ["kuwait", /(كويت|الكويتي|بورصة الكويت|kuwait|xkuw)/],
    ["saudi", /(سعود|تداول|saudi|tadawul)/],
    ["uae", /(امارات|دبي|ابوظبي|uae|dfm|adx)/],
    ["qatar", /(قطر|qatar|doha)/],
    ["bahrain", /(بحرين|bahrain)/],
    ["oman", /(عمان|مسقط|oman|muscat)/],
    ["ai", /(ذكاء اصطناعي|الذكاء|ai|artificial intelligence)/],
    ["tech", /(تقنيه|تقنية|تكنولوجيا|tech|technology)/],
    ["dividends", /(توزيع|توزيعات|ارباح|dividend|dividends)/],
    ["healthcare", /(طبي|طبيه|طبية|الطب|رعايه صحيه|رعاية صحية|صحيه|صحية|ادويه|أدوية|دواء|مستشفى|مستشفيات|بيوتك|بايوتك|healthcare|health care|medical|pharma|biotech|hospital)/],
    ["commodities", /(ذهب|فضه|فضة|نفط|برنت|غاز|نحاس|سلع|gold|silver|oil|commodities)/],
    ["food", /(طعام|اغذيه|قهوه|قهوة|كاكاو|ككاو|coffee|cocoa|food)/],
    ["crypto", /(كريبتو|رقميه|رقمية|بتكوين|بيتكوين|crypto|bitcoin)/],
    ["forex", /(فوركس|عملات|forex|fx)/],
    ["us", /(امريكا|امريكي|الامريكي|ناسداك|داو|nyse|nasdaq|us)/],
    ["europe", /(بريطانيا|لندن|المانيا|فرنسا|هولندا|سويسرا|اوروبا|europe|london|germany|france)/],
    ["asia", /(اليابان|هونغ|هونج|الصين|كوريا|الهند|اسيا|asia|tokyo|japan|china|korea|india)/],
    ["world", /(كل الاسواق|كل الأسواق|جميع الاسواق|جميع الأسواق|العالم|عالمي|world|global)/]
  ];
  return tests.find(([, pattern]) => pattern.test(clean))?.[0] || "";
}

async function getMarketPayloadForVoice(marketId) {
  const fullMarketCached = cache.get(`market:${marketId}`);
  if (fullMarketCached && Date.now() - fullMarketCached.createdAt < CACHE_TTL_MS) {
    const guardedPayload = finalizeRecommendationsPayloadForSession(fullMarketCached.payload, marketId);
    return { recommendations: guardedPayload.recommendations || [] };
  }

  const cacheKey = `voice-market:${marketId}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    const guardedPayload = finalizeRecommendationsPayloadForSession(cached.payload, marketId);
    return { recommendations: guardedPayload.recommendations || [] };
  }

  const market = markets[marketId];
  if (!market) throw new Error("السوق غير معروف");
  const settled = await settleAnalyzeAssets(market.symbols);
  const recommendations = settled
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value)
    .sort((a, b) => {
      const priority = { buy: 0, sell: 1, hold: 2 };
      return priority[a.action] - priority[b.action] || b.confidence - a.confidence;
    });
  const payload = {
    market: {
      id: marketId,
      label: market.label,
      note: market.note,
      totalSymbols: market.symbols.length
    },
    recommendations
  };
  cache.set(cacheKey, { createdAt: Date.now(), payload });
  const guardedPayload = finalizeRecommendationsPayloadForSession(payload, marketId);
  return { recommendations: guardedPayload.recommendations || [] };
}

function normalizeArabicText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[إأآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ـ/g, "")
    .replace(/\s+/g, " ");
}

function summarizeVoiceRecommendations(items) {
  return (Array.isArray(items) ? items : [])
    .slice(0, 80)
    .map((item) => ({
      symbol: item.symbol,
      name: item.name,
      action: item.action,
      actionLabel: item.actionLabel,
      confidence: item.confidence,
      currentPrice: item.currentPrice,
      expectedPrice: item.expectedPrice,
      expectedMovePct: item.expectedMovePct,
      currency: item.currency,
      duration: item.duration,
      target1: item.target1,
      target2: item.target2,
      stopLoss: item.stopLoss,
      riskReward: item.riskReward,
      latestVolume: item.latestVolume,
      averageVolume20: item.averageVolume20,
      averageVolume50: item.averageVolume50,
      relativeVolume: item.relativeVolume,
      shariaStatus: item.shariaStatus,
      shariaLabel: item.shariaLabel,
      finalScore: item.finalScore || item.score || 0,
      risk: item.risk ? { level: item.risk.level, label: item.risk.label } : null,
      analysisQuality: item.analysisQuality ? { score: item.analysisQuality.score, label: item.analysisQuality.label } : null,
      upsideOutlook: Array.isArray(item.upsideOutlook) ? item.upsideOutlook.slice(0, 3) : []
    }));
}

function isUsefulVoiceResult(result) {
  const intent = String(result?.intent || "");
  return Boolean(result?.reply) && !["unknown", "voice_error"].includes(intent);
}

async function handleOllamaStatus(response) {
  const status = await getOllamaStatus();
  return sendJson(response, status);
}

async function getOllamaStatus() {
  if (!OLLAMA_ENABLED) {
    return {
      enabled: false,
      connected: false,
      model: OLLAMA_MODEL,
      baseUrl: OLLAMA_BASE_URL,
      message: "Ollama معطل من إعدادات OLLAMA_ENABLED"
    };
  }

  try {
    const data = await fetchJsonWithTimeout(`${OLLAMA_BASE_URL}/api/tags`, {}, 1200);
    const models = Array.isArray(data.models) ? data.models.map((model) => model.name) : [];
    return {
      enabled: true,
      connected: true,
      model: OLLAMA_MODEL,
      baseUrl: OLLAMA_BASE_URL,
      models,
      hasConfiguredModel: models.includes(OLLAMA_MODEL),
      message: models.includes(OLLAMA_MODEL)
        ? `Ollama متصل والموديل ${OLLAMA_MODEL} جاهز`
        : `Ollama متصل، لكن الموديل ${OLLAMA_MODEL} غير محمل`
    };
  } catch (error) {
    return {
      enabled: true,
      connected: false,
      model: OLLAMA_MODEL,
      baseUrl: OLLAMA_BASE_URL,
      models: [],
      hasConfiguredModel: false,
      message: `Ollama غير متصل: ${error.message}`
    };
  }
}

async function runOllamaVoiceAgent(payload) {
  if (!OLLAMA_ENABLED || Date.now() < ollamaUnavailableUntil) return null;

  const english = payload.language === "en";
  const userContent = JSON.stringify({
    transcript: payload.transcript,
    language: payload.language || "ar",
    activeMarket: payload.activeMarket,
    recommendations: payload.recommendations.slice(0, 25)
  });

  const messages = [
    {
      role: "system",
      content:
        "You are the-sfm trader local voice brain. Return ONLY valid JSON. " +
        "Understand Arabic Kuwaiti and English trading commands. " +
        "Use only provided market recommendations; never invent prices or symbols. " +
        `Reply language must be ${english ? "English" : "Arabic"}. ` +
        `JSON schema: {"intent":"greeting|asset_lookup|best_buy|best_sell|best_sharia|monthly_upside|most_traded|unknown","symbol":"","monitor":false,"openDetail":false,"reply":"${english ? "English" : "Arabic"} concise reply"}. ` +
        "For asset lookup set symbol if mentioned. For monitor requests set monitor true. " +
        "For buy/sell/monthly choose the best item from recommendations and mention confidence, current price, target, and duration. " +
        "For phrases mentioning شرعي, الشريعة, مطابق للشريعة, حلال, or halal choose the best recommendation where shariaStatus is compliant and state that clearly. " +
        "Arabic phrases like أفضل سهم اليوم, ماهو أفضل سهم, أقوى سهم, شنو ترشح, or سهم اشتريه اليوم mean intent best_buy. " +
        "For most_traded choose highest latestVolume and mention volume and current recommendation. " +
        `Always include a short risk reminder in ${english ? "English" : "Arabic"} for trading recommendations.`
    },
    {
      role: "user",
      content: userContent
    }
  ];

  try {
    const data = await fetchJsonWithTimeout(
      `${OLLAMA_BASE_URL}/api/chat`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages,
          stream: false,
          format: "json",
          options: {
            temperature: 0.15,
            num_ctx: 4096
          }
        })
      },
      4500
    );

    const content = data.message?.content || data.response || "";
    const parsed = parseLooseJson(content);
    if (!parsed || typeof parsed !== "object") return null;

    const intent = normalizeVoiceIntent(parsed.intent);
    const symbol = parsed.symbol ? normalizeInputSymbol(parsed.symbol) : "";
    return {
      intent,
      symbol,
      monitor: Boolean(parsed.monitor),
      openDetail: Boolean(parsed.openDetail || intent === "asset_lookup"),
      reply: String(parsed.reply || "").slice(0, 900) || "سمعتك يا سيدي.",
      aiEngine: "ollama",
      model: OLLAMA_MODEL
    };
  } catch {
    ollamaUnavailableUntil = Date.now() + 60_000;
    return null;
  }
}

function normalizeVoiceIntent(intent) {
  const allowed = new Set(["greeting", "asset_lookup", "best_buy", "best_sell", "best_sharia", "monthly_upside", "most_traded", "unknown"]);
  const value = String(intent || "").trim().toLowerCase();
  return allowed.has(value) ? value : "unknown";
}

function parseLooseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    const match = String(value || "").match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("انتهت مهلة الاتصال");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function runPythonVoiceAgent(payload) {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, "voice_agent.py");
    const python = process.env.PYTHON || "python";
    const child = spawn(python, [scriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      resolve({
        intent: "voice_error",
        reply: "مساعد Python أخذ وقت أطول من المتوقع. حاول مرة ثانية بعد ثواني."
      });
    }, 8000);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        intent: "voice_error",
        reply: `تعذر تشغيل Python للمحادثة الصوتية: ${error.message}`
      });
    });
    child.on("close", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);

      try {
        resolve(JSON.parse(stdout));
      } catch {
        resolve({
          intent: "voice_error",
          reply: stderr || "تعذر فهم رد مساعد Python."
        });
      }
    });

    child.stdin.end(JSON.stringify(payload));
  });
}

function buildAssetVoiceReply(item, profile, monitor) {
  const monitorText = monitor
    ? " أضفته للمراقبة الصوتية، وإذا ظهرت فرصة قوية راح أنبهك."
    : "";
  return (
    `تحليل ${item.name}، الرمز ${item.symbol}. ` +
    `السعر الحالي ${formatVoiceMoney(item.currentPrice, item.currency)}، ` +
    `والهدف الأول ${formatVoiceMoney(item.target1 || item.expectedPrice, item.currency)} خلال ${item.duration}. ` +
    (item.stopLoss ? `وقف الخسارة ${formatVoiceMoney(item.stopLoss, item.currency)}. ` : "") +
    `التوصية الحالية ${item.actionLabel} بثقة ${formatVoicePercent(item.confidence)}. ` +
    `التوافق الشرعي: ${profile.shariaLabel}. ` +
    `المخاطرة ${item.risk?.label || "غير محددة"}.` +
    monitorText
  );
}

function formatVoiceMoney(value, currency) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  const digits = Math.abs(number) < 1 ? 4 : 2;
  return `${number.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })}${currency ? ` ${currency}` : ""}`;
}

function formatVoicePercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return `${number.toLocaleString("en-US", {
    maximumFractionDigits: 0
  })}%`;
}

function resolveAsset(symbol) {
  const upperSymbol = normalizeInputSymbol(symbol);
  for (const market of Object.values(markets)) {
    const match = market.symbols.find((asset) => asset.symbol.toUpperCase() === upperSymbol);
    if (match) return match;
  }

  return {
    symbol: upperSymbol,
    name: customAssetNames[upperSymbol] || upperSymbol,
    shariaStatus: "unknown",
    shariaLabel: ""
  };
}

function findMarketForAsset(symbol) {
  const upperSymbol = normalizeInputSymbol(symbol);
  for (const [id, market] of Object.entries(markets)) {
    const match = market.symbols.find((asset) => asset.symbol.toUpperCase() === upperSymbol);
    if (match) {
      return {
        id,
        label: market.label,
        region: market.region,
        note: market.note
      };
    }
  }

  return {
    id: "custom",
    label: "قائمة مخصصة",
    region: "Custom",
    note: "رمز مضاف من قائمة المراقبة، وقد يحتاج مزود بيانات يدعمه بشكل مباشر."
  };
}

function buildAssetProfile(asset, market, recommendation) {
  const symbol = normalizeInputSymbol(asset.symbol);
  const sectorInfo = getKnownAssetInfo(symbol, asset.name);
  const shariaText = getShariaText(recommendation.shariaStatus);

  return {
    specialty: sectorInfo.specialty,
    summary: sectorInfo.summary,
    marketLabel: market.label,
    region: market.region,
    exchangeName: recommendation.exchangeName || market.label,
    currency: recommendation.currency,
    shariaStatus: recommendation.shariaStatus,
    shariaLabel: recommendation.shariaLabel || shariaText.label,
    shariaDescription: shariaText.description,
    shariaSource: recommendation.shariaSource,
    shariaCheckedAt: recommendation.shariaCheckedAt
  };
}

async function enrichShariaAsset(asset) {
  if (!SHARIA_API_URL) return asset;

  const symbol = normalizeInputSymbol(asset.symbol);
  const cached = shariaCache.get(symbol);
  if (cached && Date.now() - cached.createdAt < 24 * 60 * 60 * 1000) {
    return { ...asset, ...cached.value };
  }

  try {
    const separator = SHARIA_API_URL.includes("?") ? "&" : "?";
    const data = await fetchJsonWithTimeout(
      `${SHARIA_API_URL}${separator}symbol=${encodeURIComponent(symbol)}`,
      {
        headers: {
          accept: "application/json",
          ...(SHARIA_API_KEY ? { authorization: `Bearer ${SHARIA_API_KEY}` } : {})
        }
      },
      1800
    );
    const value = normalizeExternalSharia(data);
    shariaCache.set(symbol, { createdAt: Date.now(), value });
    return { ...asset, ...value };
  } catch {
    return asset;
  }
}

function normalizeExternalSharia(data) {
  const rawStatus = String(data?.status || data?.shariaStatus || data?.compliance || data?.result || "").toLowerCase();
  const compliant = data?.compliant === true || ["compliant", "halal", "pass", "passed"].includes(rawStatus);
  const notCompliant = data?.compliant === false || ["not_compliant", "non_compliant", "non-compliant", "haram", "fail", "failed"].includes(rawStatus);
  const doubtful = ["doubtful", "questionable", "mixed", "review"].includes(rawStatus);
  const shariaStatus = compliant ? "compliant" : notCompliant ? "not_compliant" : doubtful ? "doubtful" : "unknown";
  const labels = {
    compliant: "مطابق للشريعة",
    not_compliant: "غير مطابق للشريعة",
    doubtful: "مختلف عليه",
    unknown: "غير معروف"
  };

  return {
    shariaStatus,
    shariaLabel: data?.label || data?.shariaLabel || labels[shariaStatus],
    shariaSource: data?.source || data?.provider || "مزود فحص شرعي خارجي",
    shariaCheckedAt: data?.checkedAt || data?.updatedAt || new Date().toISOString().slice(0, 10)
  };
}

function getKnownAssetInfo(symbol, name) {
  const profiles = {
    "BTC-USD": {
      specialty: "عملة رقمية ومخزن قيمة رقمي",
      summary: "Bitcoin أصل رقمي لامركزي يعمل على شبكة بلوك تشين، ويستخدم كعملة رقمية ومخزن قيمة عالي التذبذب ضمن سوق العملات الرقمية."
    },
    "ETH-USD": {
      specialty: "شبكة عقود ذكية وتطبيقات لامركزية",
      summary: "Ethereum شبكة بلوك تشين تدعم العقود الذكية والتطبيقات اللامركزية والرموز الرقمية، ويتداول أصل ETH مقابل الدولار في سوق العملات الرقمية."
    },
    "BNB-USD": {
      specialty: "أصل رقمي لمنظومة تداول وبلوكتشين",
      summary: "BNB أصل رقمي مرتبط بمنظومة BNB Chain واستخدامات رسوم الشبكة والتطبيقات اللامركزية، ويتداول ضمن سوق العملات الرقمية."
    },
    "SOL-USD": {
      specialty: "شبكة بلوك تشين عالية السرعة",
      summary: "Solana شبكة بلوك تشين تركز على السرعة وتطبيقات التمويل اللامركزي والرموز، ويتداول أصل SOL مقابل الدولار في سوق العملات الرقمية."
    },
    "XRP-USD": {
      specialty: "مدفوعات وتحويلات رقمية",
      summary: "XRP أصل رقمي يستخدم في بنية مدفوعات وتحويلات سريعة، ويتداول مقابل الدولار ضمن سوق العملات الرقمية عالي التذبذب."
    },
    "ADA-USD": {
      specialty: "شبكة عقود ذكية",
      summary: "Cardano شبكة بلوك تشين تعتمد على أصل ADA لتشغيل الشبكة والتطبيقات، ويتداول مقابل الدولار في سوق العملات الرقمية."
    },
    "DOGE-USD": {
      specialty: "عملة رقمية مجتمعية عالية التذبذب",
      summary: "Dogecoin عملة رقمية ذات طابع مجتمعي وسيولة مرتفعة، وغالباً يتأثر سعرها بالزخم والمضاربة في سوق العملات الرقمية."
    },
    "AVAX-USD": {
      specialty: "شبكة تطبيقات لامركزية",
      summary: "Avalanche شبكة بلوك تشين للتطبيقات اللامركزية والتمويل اللامركزي، ويتداول أصل AVAX مقابل الدولار في سوق العملات الرقمية."
    },
    "LINK-USD": {
      specialty: "أوراكل بيانات للبلوكتشين",
      summary: "Chainlink مشروع يربط العقود الذكية ببيانات خارجية عبر شبكات أوراكل، ويتداول أصل LINK مقابل الدولار في سوق العملات الرقمية."
    },
    "DOT-USD": {
      specialty: "شبكة ربط بين سلاسل البلوكتشين",
      summary: "Polkadot شبكة تهدف لربط سلاسل بلوك تشين متعددة، ويتداول أصل DOT مقابل الدولار في سوق العملات الرقمية."
    },
    "GC=F": {
      specialty: "ذهب - عقد آجل",
      summary: "Gold Futures يمثل تداول الذهب عبر عقد آجل في أسواق السلع. يتحرك عادة مع الدولار، عوائد السندات، التضخم، وشهية المخاطرة."
    },
    "SI=F": {
      specialty: "فضة - عقد آجل",
      summary: "Silver Futures يمثل تداول الفضة عبر عقد آجل. الفضة تتأثر بالطلب الصناعي، الدولار، الذهب، وتوقعات النمو."
    },
    "CL=F": {
      specialty: "نفط خام WTI - عقد آجل",
      summary: "WTI Crude Oil يمثل النفط الأمريكي الخفيف عبر عقد آجل. يتأثر بالمخزون، قرارات أوبك، الطلب العالمي، والدولار."
    },
    "BZ=F": {
      specialty: "نفط برنت - عقد آجل",
      summary: "Brent Crude Oil يمثل خام برنت العالمي عبر عقد آجل، ويعد مرجعاً مهماً لتسعير النفط خارج أمريكا."
    },
    "NG=F": {
      specialty: "غاز طبيعي - عقد آجل",
      summary: "Natural Gas Futures يمثل الغاز الطبيعي عبر عقد آجل. يتحرك بقوة مع الطقس، المخزون، الطلب على الطاقة، والإنتاج."
    },
    "HG=F": {
      specialty: "نحاس - عقد آجل",
      summary: "Copper Futures يمثل النحاس عبر عقد آجل، وغالباً يستخدم كمؤشر على نشاط الصناعة والبناء والطلب الصيني."
    },
    "KC=F": {
      specialty: "قهوة - عقد آجل",
      summary: "Coffee Futures يمثل القهوة عبر عقد آجل. يتأثر بالطقس في الدول المنتجة، المخزون، سلاسل الإمداد، وقوة الدولار."
    },
    "CC=F": {
      specialty: "كاكاو - عقد آجل",
      summary: "Cocoa Futures يمثل الكاكاو عبر عقد آجل. يتأثر بمحاصيل غرب أفريقيا، الطقس، الطلب الغذائي، وتكاليف الشحن."
    },
    AAPL: {
      specialty: "تقنية استهلاكية وأجهزة ذكية",
      summary: "Apple تعمل في iPhone وMac وiPad والخدمات الرقمية ومتجر التطبيقات، وتتداول في السوق الأمريكي."
    },
    MSFT: {
      specialty: "برمجيات وحوسبة سحابية وذكاء اصطناعي",
      summary: "Microsoft تعمل في أنظمة التشغيل، Azure، Office، الألعاب، وخدمات الذكاء الاصطناعي، وتتداول في السوق الأمريكي."
    },
    NVDA: {
      specialty: "رقائق رسومية وذكاء اصطناعي",
      summary: "NVIDIA تقود سوق معالجات الرسوم ومسرعات الذكاء الاصطناعي ومراكز البيانات، وتتداول في السوق الأمريكي."
    },
    AMD: {
      specialty: "معالجات ورقائق حوسبة",
      summary: "AMD تعمل في معالجات الحواسيب والخوادم والبطاقات الرسومية ومسرعات الذكاء الاصطناعي، وتتداول في السوق الأمريكي."
    },
    GOOGL: {
      specialty: "إعلانات رقمية وبحث وسحابة",
      summary: "Alphabet / Google تعمل في البحث، الإعلانات، YouTube، Android، Google Cloud، وتقنيات الذكاء الاصطناعي."
    },
    AMZN: {
      specialty: "تجارة إلكترونية وحوسبة سحابية",
      summary: "Amazon تعمل في التجارة الإلكترونية، AWS، الاشتراكات، اللوجستيات، والإعلانات الرقمية."
    },
    TSLA: {
      specialty: "سيارات كهربائية وطاقة",
      summary: "Tesla تعمل في السيارات الكهربائية، البطاريات، حلول الطاقة، والقيادة الذاتية."
    },
    META: {
      specialty: "شبكات اجتماعية وإعلانات رقمية",
      summary: "Meta تعمل في Facebook وInstagram وWhatsApp والإعلانات الرقمية ومنصات الواقع الممتد."
    },
    KFH_KW: {
      specialty: "مصرفية إسلامية",
      summary: "بيت التمويل الكويتي بنك إسلامي كويتي يقدم خدمات التمويل والاستثمار والخدمات المصرفية، ويتداول في بورصة الكويت."
    },
    NBK_KW: {
      specialty: "مصرفية تقليدية",
      summary: "بنك الكويت الوطني من أكبر البنوك الكويتية ويعمل في الخدمات المصرفية للأفراد والشركات والاستثمار."
    },
    ZAIN_KW: {
      specialty: "اتصالات وخدمات رقمية",
      summary: "زين الكويت تعمل في الاتصالات المتنقلة، الإنترنت، والخدمات الرقمية في الكويت وأسواق إقليمية."
    }
  };
  const key = symbol.replaceAll(".", "_");
  if (profiles[symbol]) return profiles[symbol];
  if (profiles[key]) return profiles[key];

  if (symbol.endsWith("=X")) {
    return {
      specialty: "زوج عملات فوركس",
      summary: `${name} زوج عملات في سوق الفوركس، ويتأثر بأسعار الفائدة، السيولة، وقوة العملات بين البلدين.`
    };
  }

  if (symbol.endsWith("-USD")) {
    return {
      specialty: "أصل رقمي مشفر",
      summary: `${name} أصل رقمي يتداول مقابل الدولار في سوق العملات الرقمية. يتحرك عادة بتذبذب مرتفع ويتأثر بالسيولة، اتجاه Bitcoin، شهية المخاطرة، وأخبار التنظيم والمنصات.`
    };
  }

  if (symbol.endsWith("=F")) {
    return {
      specialty: "سلعة أو عقد آجل",
      summary: `${name} عقد آجل أو أصل سلعي يتداول في أسواق السلع. يحتاج متابعة وقت الجلسة، السيولة، الأخبار الاقتصادية، وإدارة مخاطرة صارمة لأن الحركة قد تكون سريعة.`
    };
  }

  if (symbol.startsWith("^")) {
    return {
      specialty: "مؤشر سوق",
      summary: `${name} مؤشر يقيس حركة مجموعة من الأسهم داخل سوق أو قطاع محدد. المؤشرات لا تمثل سهماً واحداً، لذلك تحليلها يعتمد على اتجاه السوق العام، السيولة، الأخبار الاقتصادية، وحركة الشركات القيادية داخل المؤشر.`
    };
  }

  return {
    specialty: "أداة مالية مدرجة",
    summary: `${name} رمز مالي يتداول في السوق المرتبط به. للحصول على وصف تفصيلي أدق، اربطه بمزود بيانات أساسي أو ملف معلومات شركات.`
  };
}

function getShariaText(status) {
  if (status === "compliant") {
    return {
      label: "مطابق للشريعة",
      description: "مصنف داخلياً كمتوافق مع الشريعة حسب البيانات المتاحة في التطبيق."
    };
  }

  if (status === "not_compliant") {
    return {
      label: "غير مطابق للشريعة",
      description: "مصنف داخلياً كغير متوافق مع الشريعة، ويفضل تجنبه إذا كان شرطك الالتزام الشرعي."
    };
  }

  if (status === "doubtful") {
    return {
      label: "مختلف عليه",
      description: "التصنيف الشرعي غير محسوم في بيانات التطبيق ويحتاج مراجعة جهة فحص شرعي."
    };
  }

  return {
    label: "غير معروف",
    description: "لا يوجد تصنيف شرعي مؤكد لهذا الرمز داخل التطبيق حالياً."
  };
}

async function settleAnalyzeAssets(assets, concurrency = 3, analysisOptions = {}) {
  return await createAnalyzeAssetsJob(assets, concurrency, analysisOptions).done;
}

function createAnalyzeAssetsJob(assets, concurrency = ANALYSIS_CONCURRENCY, analysisOptions = {}) {
  const results = new Array(assets.length);
  let nextIndex = 0;
  let completed = 0;
  let cancelled = false;

  async function worker() {
    while (!cancelled && nextIndex < assets.length) {
      const index = nextIndex;
      nextIndex += 1;

      try {
        results[index] = {
          status: "fulfilled",
          value: await analyzeSymbol(await enrichShariaAsset(assets[index]), analysisOptions)
        };
      } catch (error) {
        results[index] = {
          status: "rejected",
          reason: error
        };
      } finally {
        completed += 1;
      }
    }
  }

  const done = Promise.all(Array.from({ length: Math.min(concurrency, assets.length) }, worker)).then(() => results);
  return {
    results,
    done,
    cancel() {
      cancelled = true;
    },
    get completed() {
      return completed;
    }
  };
}

async function waitForPromise(promise, timeoutMs) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(false), timeoutMs);
  });

  const completed = await Promise.race([
    promise.then(() => true, () => true),
    timeout
  ]);
  clearTimeout(timer);
  return completed;
}

function getAnalysisConcurrency(size) {
  if (size >= 60) return Math.max(2, Math.min(ANALYSIS_CONCURRENCY, 3));
  if (size >= 20) return Math.max(2, Math.min(ANALYSIS_CONCURRENCY, 4));
  return Math.max(2, ANALYSIS_CONCURRENCY);
}

function normalizeInputSymbol(value) {
  const symbol = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9.^=-]/g, "")
    .slice(0, 18);
  return symbolAliases[symbol] || symbol;
}

function buildOpportunityRadar(recommendations) {
  const items = Array.isArray(recommendations) ? recommendations : [];
  const buys = items.filter((item) => item.action === "buy");
  const sells = items.filter((item) => item.action === "sell");
  const shariaBuys = buys.filter((item) => item.shariaStatus === "compliant");
  const highRisk = items
    .filter((item) => item.risk?.level === "high" || item.decision?.kind === "avoid")
    .sort((a, b) => getRadarScore(b) - getRadarScore(a))
    .slice(0, 6);
  const monthly = buildMonthlyRadar(items);

  return {
    bestBuy: toRadarItem(pickBest(buys, getRadarScore), "أقوى شراء"),
    bestSell: toRadarItem(pickBest(sells, getRadarScore), "أقوى بيع"),
    mostTraded: toRadarItem(pickBest(items, (item) => Number(item.latestVolume || 0)), "أكثر تداول"),
    bestRiskReward: toRadarItem(pickBest(items.filter((item) => Number(item.riskReward) >= 1), (item) => Number(item.riskReward || 0) * 30 + getRadarScore(item)), "أفضل عائد/مخاطرة"),
    shariaOpportunity: toRadarItem(pickBest(shariaBuys, getRadarScore), "أفضل فرصة شرعية"),
    monthlyUpside: monthly,
    avoid: highRisk.map((item) => toRadarItem(item, "تجنب الآن")).filter(Boolean)
  };
}

function buildMonthlyRadar(items) {
  return [1, 2, 3].map((month) => {
    const candidate = items
      .flatMap((item) => (item.upsideOutlook || []).map((outlook) => ({ item, outlook })))
      .filter(({ item, outlook }) => outlook.months === month && outlook.targetPrice > item.currentPrice)
      .sort((a, b) => {
        const scoreA = a.outlook.confidence + Number(a.outlook.movePct || 0) * 1.4 + getRadarScore(a.item) * 0.25;
        const scoreB = b.outlook.confidence + Number(b.outlook.movePct || 0) * 1.4 + getRadarScore(b.item) * 0.25;
        return scoreB - scoreA;
      })[0];

    if (!candidate) {
      return {
        months: month,
        label: month === 1 ? "شهر" : month === 2 ? "شهرين" : "3 شهور",
        empty: true
      };
    }

    return {
      ...toRadarItem(candidate.item, month === 1 ? "صعود خلال شهر" : month === 2 ? "صعود خلال شهرين" : "صعود خلال 3 شهور"),
      months: month,
      label: candidate.outlook.label,
      targetPrice: candidate.outlook.targetPrice,
      movePct: candidate.outlook.movePct,
      confidence: candidate.outlook.confidence
    };
  });
}

function pickBest(items, scorer) {
  if (!items.length) return null;
  return [...items].sort((a, b) => scorer(b) - scorer(a))[0];
}

function toRadarItem(item, label) {
  if (!item) return null;

  return {
    label,
    symbol: item.symbol,
    name: item.name,
    action: item.action,
    actionLabel: item.actionLabel,
    confidence: item.confidence,
    currentPrice: item.currentPrice,
    expectedPrice: item.expectedPrice,
    target1: item.target1,
    target2: item.target2,
    stopLoss: item.stopLoss,
    riskReward: item.riskReward,
    expectedMovePct: item.expectedMovePct,
    currency: item.currency,
    latestVolume: item.latestVolume,
    relativeVolume: item.relativeVolume,
    shariaStatus: item.shariaStatus,
    shariaLabel: item.shariaLabel,
    risk: item.risk,
    decision: item.decision,
    analysisQuality: item.analysisQuality,
    dataHealth: item.dataHealth,
    score: getRadarScore(item)
  };
}

function getRadarScore(item) {
  const confidence = Number(item.confidence || 0) * 0.34;
  const agreement = Number(item.timeframeConsensus?.agreementPct || 0) * 0.15;
  const quality = Number(item.analysisQuality?.score || 0) * 0.16;
  const dataHealth = Number(item.dataHealth?.score || 0) * 0.1;
  const riskReward = Math.min(Number(item.riskReward || 0), 3) * 7;
  const backtest = Number.isFinite(item.backtest?.winRate) ? Number(item.backtest.winRate) * 0.08 : 4;
  const sharia = item.shariaStatus === "compliant" ? 6 : item.shariaStatus === "not_compliant" ? -4 : 0;
  const risk = item.risk?.level === "low" ? 6 : item.risk?.level === "medium" ? 2 : -6;
  const conflict = item.timeframeConsensus?.conflict ? -8 : 0;
  const lowDataPenalty = Number(item.dataHealth?.score || 100) < 55 ? -7 : 0;
  return Math.round(Math.max(0, Math.min(100, confidence + agreement + quality + dataHealth + riskReward + backtest + sharia + risk + conflict + lowDataPenalty)));
}

function buildSmartAlerts(recommendations) {
  return recommendations
    .filter((item) => {
      const agreement = item.timeframeConsensus?.agreementPct || 0;
      return (
        item.action === "buy" &&
        item.shariaStatus === "compliant" &&
        item.confidence >= 70 &&
        agreement >= 60 &&
        Number(item.dataHealth?.score || 0) >= 60 &&
        item.risk?.level !== "high"
      );
    })
    .sort((a, b) => b.confidence - a.confidence || Math.abs(b.expectedMovePct) - Math.abs(a.expectedMovePct))
    .slice(0, 8)
    .map((item) => ({
      symbol: item.symbol,
      name: item.name,
      confidence: item.confidence,
      currentPrice: item.currentPrice,
      expectedPrice: item.expectedPrice,
      expectedMovePct: item.expectedMovePct,
      currency: item.currency,
      risk: item.risk,
      timeframeConsensus: item.timeframeConsensus,
      message: `${item.symbol}: شراء شرعي بثقة ${item.confidence}% وتوافق فريمات ${item.timeframeConsensus?.agreementPct || 0}%`
    }));
}

function buildBacktestSummary(recommendations) {
  const tested = recommendations.filter((item) => Number.isFinite(item.backtest?.winRate));
  if (!tested.length) {
    return {
      tested: 0,
      avgWinRate: null,
      bestSymbol: null,
      note: "لا توجد بيانات اختبار خلفي كافية"
    };
  }

  const avgWinRate = tested.reduce((sum, item) => sum + item.backtest.winRate, 0) / tested.length;
  const best = [...tested].sort((a, b) => b.backtest.winRate - a.backtest.winRate)[0];

  return {
    tested: tested.length,
    avgWinRate: Math.round(avgWinRate * 10) / 10,
    bestSymbol: best.symbol,
    bestWinRate: best.backtest.winRate,
    horizonDays: best.backtest.horizonDays
  };
}

async function serveStatic(response, pathname) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const requestedPath = path.normalize(path.join(publicDir, safePath));

  if (!requestedPath.startsWith(publicDir)) {
    return sendText(response, "Forbidden", 403);
  }

  try {
    const file = await readFile(requestedPath);
    const ext = path.extname(requestedPath);
    response.writeHead(200, {
      "content-type": mimeTypes[ext] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(file);
  } catch {
    const fallback = await readFile(path.join(publicDir, "index.html"));
    response.writeHead(200, { "content-type": mimeTypes[".html"], "cache-control": "no-store" });
    response.end(fallback);
  }
}

async function readJsonBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) {
      throw new Error("حجم الطلب أكبر من المسموح");
    }
  }

  if (!body.trim()) return {};
  return JSON.parse(body);
}

function sendJson(response, payload, status = 200) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*"
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, text, status = 200) {
  response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  response.end(text);
}
