const YAHOO_CHART_BASES = [
  "https://query1.finance.yahoo.com/v8/finance/chart",
  "https://query2.finance.yahoo.com/v8/finance/chart"
];
const FINNHUB_BASE = "https://finnhub.io/api/v1/stock/candle";
const ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query";
const TWELVE_DATA_BASE = "https://api.twelvedata.com";
const responseCache = new Map();
const RESPONSE_CACHE_TTL_MS = 45_000;
const PROVIDER_REQUEST_TIMEOUT_MS = Number(process.env.PROVIDER_REQUEST_TIMEOUT_MS || 3_500);
const PROVIDER_MAX_ATTEMPTS = Math.max(1, Number(process.env.PROVIDER_MAX_ATTEMPTS || 2));
const PROVIDER_MAX_CONCURRENT = Math.max(1, Number(process.env.PROVIDER_MAX_CONCURRENT || 3));
const PROVIDER_MIN_START_GAP_MS = Math.max(0, Number(process.env.PROVIDER_MIN_START_GAP_MS || 240));
const providerQueue = [];
let providerActiveRequests = 0;
let providerLastStartAt = 0;

export async function fetchChart(symbol, options = {}) {
  const preferred = (process.env.DATA_PROVIDER || "yahoo").toLowerCase();
  const providers = getProviderOrder(preferred);
  const errors = [];

  for (const provider of providers) {
    try {
      if (provider === "twelvedata") return await fetchTwelveDataChart(symbol, options);
      if (provider === "finnhub") return await fetchFinnhubChart(symbol, options);
      if (provider === "alphavantage") return await fetchAlphaVantageChart(symbol, options);
      return await fetchYahooChart(symbol, options);
    } catch (error) {
      errors.push(`${provider}: ${error.message}`);
    }
  }

  throw new Error(`تعذر جلب البيانات من كل المزودين. ${errors.join(" | ")}`);
}

export function getConfiguredProvider() {
  const preferred = (process.env.DATA_PROVIDER || "yahoo").toLowerCase();
  if (preferred === "twelvedata" && process.env.TWELVE_DATA_API_KEY) return "twelvedata";
  if (preferred === "finnhub" && process.env.FINNHUB_API_KEY) return "finnhub";
  if (preferred === "alphavantage" && process.env.ALPHA_VANTAGE_API_KEY) return "alphavantage";
  return "yahoo";
}

function getProviderOrder(preferred) {
  if (preferred === "twelvedata") return ["twelvedata", "yahoo"];
  if (preferred === "finnhub") return ["finnhub", "yahoo"];
  if (preferred === "alphavantage") return ["alphavantage", "yahoo"];
  return ["yahoo"];
}

async function fetchYahooChart(symbol, options = {}) {
  const range = options.range || "6mo";
  const interval = options.interval || "1d";
  const includePrePost = options.includePrePost ? "true" : "false";
  const errors = [];
  let response;

  for (const baseUrl of YAHOO_CHART_BASES) {
    const url = `${baseUrl}/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}&includePrePost=${includePrePost}`;
    try {
      response = await fetchJson(url);
      break;
    } catch (error) {
      errors.push(error.message);
    }
  }

  const result = response?.chart?.result?.[0];
  if (!response?.chart) {
    response = { chart: { error: { description: errors.join(" | ") } } };
  }

  if (!result) {
    throw new Error(response.chart?.error?.description || "لا توجد بيانات متاحة لهذا الرمز");
  }

  result.meta = {
    ...result.meta,
    dataProvider: "Yahoo Finance"
  };

  return response;
}

async function fetchFinnhubChart(symbol, options = {}) {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) throw new Error("FINNHUB_API_KEY غير موجود");
  if (!isPlainTicker(symbol)) throw new Error("Finnhub مفعّل للأسهم الأمريكية البسيطة فقط في هذه النسخة");

  const to = Math.floor(Date.now() / 1000);
  const resolution = mapFinnhubResolution(options.interval || "1d");
  const from = to - getRangeSeconds(options.range || "8mo");
  const url = `${FINNHUB_BASE}?symbol=${encodeURIComponent(symbol)}&resolution=${encodeURIComponent(resolution)}&from=${from}&to=${to}&token=${encodeURIComponent(token)}`;
  const data = await fetchJson(url);

  if (data.s !== "ok" || !Array.isArray(data.c) || data.c.length < 35) {
    throw new Error(data.s === "no_data" ? "لا توجد بيانات من Finnhub" : "استجابة Finnhub غير كافية");
  }

  return normalizeProviderResult({
    symbol,
    currency: "USD",
    exchangeName: "Finnhub",
    dataProvider: "Finnhub",
    timestamps: data.t,
    close: data.c,
    high: data.h,
    low: data.l,
    volume: data.v
  });
}

async function fetchAlphaVantageChart(symbol, options = {}) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error("ALPHA_VANTAGE_API_KEY غير موجود");
  if (!isPlainTicker(symbol)) throw new Error("Alpha Vantage مفعّل للأسهم الأمريكية البسيطة فقط في هذه النسخة");

  const request = buildAlphaVantageRequest(symbol, options, apiKey);
  const { seriesKey, ...query } = request;
  const url = `${ALPHA_VANTAGE_BASE}?${new URLSearchParams(query)}`;
  const data = await fetchJson(url);
  const series = data[seriesKey];

  if (!series) {
    throw new Error(data.Note || data.Information || data["Error Message"] || "استجابة Alpha Vantage غير كافية");
  }

  const rows = Object.entries(series)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, row]) => ({
      timestamp: parseAlphaVantageTimestamp(date),
      close: Number(row["4. close"]),
      high: Number(row["2. high"]),
      low: Number(row["3. low"]),
      volume: Number(row["5. volume"])
    }))
    .filter((row) => Number.isFinite(row.close));

  if (rows.length < 35) {
    throw new Error("بيانات Alpha Vantage غير كافية");
  }

  return normalizeProviderResult({
    symbol,
    currency: "USD",
    exchangeName: "Alpha Vantage",
    dataProvider: "Alpha Vantage",
    timestamps: rows.map((row) => row.timestamp),
    close: rows.map((row) => row.close),
    high: rows.map((row) => row.high),
    low: rows.map((row) => row.low),
    volume: rows.map((row) => row.volume)
  });
}

function parseAlphaVantageTimestamp(value) {
  const text = String(value);
  const normalized = text.includes(" ") ? text.replace(" ", "T") : `${text}T00:00:00`;
  return Math.floor(new Date(`${normalized}Z`).getTime() / 1000);
}

async function fetchTwelveDataChart(symbol, options = {}) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) throw new Error("TWELVE_DATA_API_KEY غير موجود");
  if (/\.[A-Z]{1,4}$/i.test(symbol)) {
    throw new Error("Twelve Data يحتاج تحديد البورصة للرموز ذات اللاحقة؛ سيتم استخدام المزود الاحتياطي");
  }

  const tdSymbol = mapTwelveDataSymbol(symbol);
  const interval = mapTwelveDataInterval(options.interval || "1day");
  const outputsize = getOutputSize(options.range || "6mo", interval);
  const params = new URLSearchParams({
    symbol: tdSymbol,
    interval,
    outputsize: String(outputsize),
    format: "JSON",
    apikey: apiKey
  });
  const data = await fetchJson(`${TWELVE_DATA_BASE}/time_series?${params}`);

  if (data.status === "error" || !Array.isArray(data.values)) {
    throw new Error(data.message || "استجابة Twelve Data غير كافية");
  }

  const rows = data.values
    .map((row) => ({
      timestamp: Math.floor(new Date(row.datetime).getTime() / 1000),
      close: Number(row.close),
      high: Number(row.high),
      low: Number(row.low),
      volume: Number(row.volume || 0)
    }))
    .filter((row) => Number.isFinite(row.timestamp) && Number.isFinite(row.close))
    .sort((a, b) => a.timestamp - b.timestamp);

  if (rows.length < 25) {
    throw new Error("بيانات Twelve Data غير كافية");
  }

  return normalizeProviderResult({
    symbol,
    currency: inferCurrency(symbol, data.meta),
    exchangeName: data.meta?.exchange || data.meta?.mic_code || "Twelve Data",
    dataProvider: "Twelve Data",
    timestamps: rows.map((row) => row.timestamp),
    close: rows.map((row) => row.close),
    high: rows.map((row) => row.high),
    low: rows.map((row) => row.low),
    volume: rows.map((row) => row.volume)
  });
}

function buildAlphaVantageRequest(symbol, options, apiKey) {
  const interval = String(options.interval || "1d");
  const common = {
    symbol,
    outputsize: "compact",
    apikey: apiKey
  };

  if (["1m", "5m", "15m", "30m", "60m"].includes(interval)) {
    return {
      ...common,
      function: "TIME_SERIES_INTRADAY",
      interval: interval === "1m" ? "1min" : interval === "60m" ? "60min" : interval.replace("m", "min"),
      seriesKey: `Time Series (${interval === "1m" ? "1min" : interval === "60m" ? "60min" : interval.replace("m", "min")})`
    };
  }

  if (interval === "1wk") {
    return { ...common, function: "TIME_SERIES_WEEKLY", seriesKey: "Weekly Time Series" };
  }

  if (interval === "1mo") {
    return { ...common, function: "TIME_SERIES_MONTHLY", seriesKey: "Monthly Time Series" };
  }

  return { ...common, function: "TIME_SERIES_DAILY", seriesKey: "Time Series (Daily)" };
}

function mapFinnhubResolution(interval) {
  return {
    "1m": "1",
    "5m": "5",
    "15m": "15",
    "30m": "30",
    "60m": "60",
    "1h": "60",
    "1d": "D",
    "1wk": "W",
    "1mo": "M"
  }[interval] || "D";
}

function mapTwelveDataInterval(interval) {
  return {
    "1m": "1min",
    "5m": "5min",
    "15m": "15min",
    "30m": "30min",
    "60m": "1h",
    "1h": "1h",
    "1d": "1day",
    "1wk": "1week",
    "1mo": "1month"
  }[interval] || "1day";
}

function mapTwelveDataSymbol(symbol) {
  if (symbol.endsWith("=X") && symbol.length >= 7) {
    const pair = symbol.replace("=X", "");
    return `${pair.slice(0, 3)}/${pair.slice(3)}`;
  }

  if (symbol.endsWith("-USD")) {
    return `${symbol.replace("-USD", "")}/USD`;
  }

  return symbol;
}

function inferCurrency(symbol, meta = {}) {
  if (meta.currency) return normalizeCurrencyCode(meta.currency);
  if (symbol.endsWith("=F")) return "USD";
  if (symbol.endsWith("-USD")) return "USD";
  if (symbol.endsWith("=X")) return "PAIR";
  if (symbol.endsWith(".KW")) return "KWD";
  if (symbol.endsWith(".SR")) return "SAR";
  if (symbol.endsWith(".AE") || symbol.endsWith(".AD") || symbol.endsWith(".DU")) return "AED";
  if (symbol.endsWith(".QA")) return "QAR";
  if (symbol.endsWith(".BH")) return "BHD";
  if (symbol.endsWith(".OM")) return "OMR";
  return "USD";
}

function normalizeCurrencyCode(currency) {
  const code = String(currency || "").trim().toUpperCase();
  return {
    PAIR: "PAIR",
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

function getRangeSeconds(range) {
  return {
    "1d": 2 * 24 * 60 * 60,
    "5d": 7 * 24 * 60 * 60,
    "1mo": 35 * 24 * 60 * 60,
    "3mo": 100 * 24 * 60 * 60,
    "6mo": 210 * 24 * 60 * 60,
    "1y": 380 * 24 * 60 * 60,
    "5y": 5 * 380 * 24 * 60 * 60,
    "10y": 10 * 380 * 24 * 60 * 60
  }[range] || 240 * 24 * 60 * 60;
}

function getOutputSize(range, interval) {
  const byRange = {
    "1d": interval === "1min" ? 420 : 120,
    "5d": 220,
    "1mo": 260,
    "3mo": 520,
    "6mo": 180,
    "1y": 260,
    "5y": 320,
    "10y": 480
  };
  return byRange[range] || 260;
}

async function fetchJson(url) {
  const cached = responseCache.get(url);
  if (cached && Date.now() - cached.createdAt < RESPONSE_CACHE_TTL_MS) {
    return structuredClone(cached.data);
  }

  let response;
  for (let attempt = 0; attempt < PROVIDER_MAX_ATTEMPTS; attempt += 1) {
    try {
      response = await scheduleProviderRequest(() => fetchWithTimeout(url));
    } catch (error) {
      if (error.name === "AbortError") {
        if (attempt < PROVIDER_MAX_ATTEMPTS - 1) {
          await delay(450 * (attempt + 1));
          continue;
        }
        throw new Error("انتهت مهلة مزود البيانات");
      }

      throw error;
    }

    if (response.status !== 429) break;
    if (attempt < PROVIDER_MAX_ATTEMPTS - 1) {
      await delay(800 * (attempt + 1));
    }
  }

  if (!response?.ok) {
    throw new Error(`تعذر جلب البيانات: ${response?.status ?? "لا استجابة"}`);
  }

  const data = await response.json();
  responseCache.set(url, { createdAt: Date.now(), data });
  return structuredClone(data);
}

function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_REQUEST_TIMEOUT_MS);

  return fetch(url, {
    signal: controller.signal,
    headers: {
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9,ar;q=0.8",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
    }
  }).finally(() => {
    clearTimeout(timer);
  });
}

function scheduleProviderRequest(task) {
  return new Promise((resolve, reject) => {
    providerQueue.push({ task, resolve, reject });
    drainProviderQueue();
  });
}

function drainProviderQueue() {
  while (providerActiveRequests < PROVIDER_MAX_CONCURRENT && providerQueue.length) {
    const now = Date.now();
    const scheduledStartAt = Math.max(now, providerLastStartAt + PROVIDER_MIN_START_GAP_MS);
    const waitMs = Math.max(0, scheduledStartAt - now);
    const entry = providerQueue.shift();
    providerLastStartAt = scheduledStartAt;

    providerActiveRequests += 1;
    windowlessDelay(waitMs)
      .then(() => {
        return entry.task();
      })
      .then(entry.resolve, entry.reject)
      .finally(() => {
        providerActiveRequests -= 1;
        drainProviderQueue();
      });
  }
}

function windowlessDelay(ms) {
  if (ms <= 0) return Promise.resolve();
  return delay(ms);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeProviderResult({ symbol, currency, exchangeName, dataProvider, timestamps, close, high, low, volume }) {
  return {
    chart: {
      result: [
        {
          timestamp: timestamps,
          meta: {
            symbol,
            currency,
            exchangeName,
            fullExchangeName: exchangeName,
            regularMarketPrice: close.at(-1),
            marketState: "",
            exchangeTimezoneShortName: "",
            dataProvider
          },
          indicators: {
            quote: [
              {
                close,
                high,
                low,
                volume
              }
            ]
          }
        }
      ],
      error: null
    }
  };
}

function isPlainTicker(symbol) {
  return /^[A-Z.]{1,10}$/.test(symbol) && !symbol.includes("=") && !symbol.includes(".SR") && !symbol.includes(".KW");
}
