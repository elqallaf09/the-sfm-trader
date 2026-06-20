const FOREX_FACTORY_CALENDAR_URL = process.env.FOREX_FACTORY_CALENDAR_URL || "https://nfs.faireconomy.media/ff_calendar_thisweek.xml";
const ECONOMIC_CALENDAR_TZ = process.env.ECONOMIC_CALENDAR_TZ || "America/New_York";
const ECONOMIC_CALENDAR_CACHE_TTL_MS = Number(process.env.ECONOMIC_CALENDAR_CACHE_TTL_MS || 15 * 60_000);
const ECONOMIC_CALENDAR_TIMEOUT_MS = Number(process.env.ECONOMIC_CALENDAR_TIMEOUT_MS || 2_500);
const HIGH_IMPACT_BLOCK_BEFORE_MIN = 75;
const HIGH_IMPACT_BLOCK_AFTER_MIN = 90;
const HIGH_IMPACT_WATCH_MIN = 24 * 60;
const MEDIUM_IMPACT_WATCH_MIN = 6 * 60;

let calendarCache = {
  createdAt: 0,
  events: [],
  error: null
};

export async function getEconomicCalendarForMarket(marketId = "us", symbols = []) {
  const events = await getEconomicCalendarEvents();
  return buildEconomicCalendarPayload(marketId, symbols, events);
}

export function buildEconomicCalendarPayload(marketId = "us", symbols = [], events = []) {
  const now = Date.now();
  const currencies = getMarketCurrencies(marketId, symbols);
  const relevant = events
    .filter((event) => currencies.has(event.currency))
    .filter((event) => Math.abs(event.timestamp - now) <= 72 * 60 * 60 * 1000)
    .sort((a, b) => a.timestamp - b.timestamp);
  const highImpact = relevant.filter((event) => event.impact === "high");
  const upcoming = relevant.filter((event) => event.timestamp >= now).slice(0, 12);
  const nextHighImpact = highImpact.find((event) => event.timestamp >= now) || null;
  const hotEvents = relevant
    .filter((event) => {
      const minutes = (event.timestamp - now) / 60_000;
      return event.impact === "high" && minutes >= -HIGH_IMPACT_BLOCK_AFTER_MIN && minutes <= HIGH_IMPACT_BLOCK_BEFORE_MIN;
    })
    .slice(0, 6);

  return {
    source: "ForexFactory / Fair Economy",
    sourceUrl: FOREX_FACTORY_CALENDAR_URL,
    timeZone: ECONOMIC_CALENDAR_TZ,
    generatedAt: new Date().toISOString(),
    marketId,
    currencies: [...currencies],
    status: hotEvents.length ? "hot" : nextHighImpact ? "watch" : "clear",
    summary: buildCalendarSummary(upcoming, hotEvents, nextHighImpact),
    nextHighImpact,
    upcoming,
    hotEvents,
    error: calendarCache.error
  };
}

export function applyEconomicNewsOverlayToRecommendations(recommendations = [], marketId = "us", calendarPayload = null) {
  const events = Array.isArray(calendarPayload?.upcoming)
    ? [...calendarPayload.hotEvents || [], ...calendarPayload.upcoming]
    : [];

  if (!events.length) {
    return recommendations.map((item) => ({
      ...item,
      economicNewsRisk: buildClearNewsRisk(item, marketId)
    }));
  }

  return recommendations.map((item) => applyEconomicNewsOverlay(item, marketId, events));
}

async function getEconomicCalendarEvents() {
  if (calendarCache.events.length && Date.now() - calendarCache.createdAt < ECONOMIC_CALENDAR_CACHE_TTL_MS) {
    return calendarCache.events;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ECONOMIC_CALENDAR_TIMEOUT_MS);
    const response = await fetch(FOREX_FACTORY_CALENDAR_URL, {
      signal: controller.signal,
      headers: {
        "user-agent": "the-sfm-trader/1.0 economic-calendar"
      }
    });
    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`calendar http ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const xml = new TextDecoder("windows-1252").decode(buffer);
    const events = parseForexFactoryXml(xml)
      .filter((event) => event.timestamp && event.currency && event.impact !== "low")
      .sort((a, b) => a.timestamp - b.timestamp);

    calendarCache = {
      createdAt: Date.now(),
      events,
      error: null
    };
    return events;
  } catch (error) {
    calendarCache = {
      ...calendarCache,
      error: error?.message || "تعذر تحميل رزنامة الأخبار"
    };
    return calendarCache.events || [];
  }
}

function parseForexFactoryXml(xml) {
  return [...String(xml || "").matchAll(/<event>([\s\S]*?)<\/event>/gi)]
    .map((match) => {
      const block = match[1];
      const date = readXmlField(block, "date");
      const time = readXmlField(block, "time");
      const parsedDate = parseCalendarDate(date, time);

      return {
        title: readXmlField(block, "title"),
        currency: readXmlField(block, "country").toUpperCase(),
        impact: normalizeImpact(readXmlField(block, "impact")),
        date,
        time,
        timestamp: parsedDate.date ? parsedDate.date.getTime() : null,
        isoTime: parsedDate.date ? parsedDate.date.toISOString() : null,
        exactTime: parsedDate.exact,
        forecast: readXmlField(block, "forecast"),
        previous: readXmlField(block, "previous"),
        url: readXmlField(block, "url"),
        localTimeLabel: parsedDate.date ? formatEventTime(parsedDate.date) : ""
      };
    });
}

function readXmlField(block, field) {
  const match = String(block || "").match(new RegExp(`<${field}>([\\s\\S]*?)<\\/${field}>`, "i"));
  if (!match) return "";
  return decodeXml(match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim());
}

function decodeXml(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&apos;", "'");
}

function normalizeImpact(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("high")) return "high";
  if (text.includes("medium")) return "medium";
  return "low";
}

function parseCalendarDate(dateText, timeText) {
  const dateParts = String(dateText || "").match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!dateParts) return { date: null, exact: false };

  const month = Number(dateParts[1]);
  const day = Number(dateParts[2]);
  const year = Number(dateParts[3]);
  const time = String(timeText || "").trim().toLowerCase();
  const timeParts = time.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
  let hour = 12;
  let minute = 0;
  let exact = false;

  if (timeParts) {
    hour = Number(timeParts[1]) % 12;
    if (timeParts[3] === "pm") hour += 12;
    minute = Number(timeParts[2]);
    exact = true;
  }

  return {
    date: zonedTimeToUtc({ year, month, day, hour, minute }, ECONOMIC_CALENDAR_TZ),
    exact
  };
}

function zonedTimeToUtc(parts, timeZone) {
  let timestamp = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);

  for (let index = 0; index < 3; index += 1) {
    const observed = getZonedParts(new Date(timestamp), timeZone);
    const observedUtc = Date.UTC(observed.year, observed.month - 1, observed.day, observed.hour, observed.minute, 0);
    const targetUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
    timestamp -= observedUtc - targetUtc;
  }

  return new Date(timestamp);
}

function getZonedParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute
  };
}

function formatEventTime(date) {
  return new Intl.DateTimeFormat("ar-KW-u-nu-latn", {
    timeZone: "Asia/Kuwait",
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function getMarketCurrencies(marketId, symbols = []) {
  const currencies = new Set();
  const marketCurrencyMap = {
    forex: ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD"],
    commodities: ["USD", "CAD", "AUD"],
    crypto: ["USD"],
    us: ["USD"],
    healthcare: ["USD"],
    tech: ["USD"],
    ai: ["USD"],
    dividends: ["USD"],
    food: ["USD"]
  };

  for (const currency of marketCurrencyMap[marketId] || []) currencies.add(currency);
  for (const symbol of symbols || []) {
    for (const currency of getSymbolCurrencies(symbol, marketId)) currencies.add(currency);
  }

  if (!currencies.size) currencies.add("USD");
  return currencies;
}

function getSymbolCurrencies(symbol, marketId = "") {
  const clean = String(symbol || "").toUpperCase();
  const pair = clean.match(/^([A-Z]{3})([A-Z]{3})=X$/);
  if (pair) return [pair[1], pair[2]];
  if (["GC=F", "SI=F", "CL=F", "BZ=F", "NG=F", "HG=F", "KC=F", "CC=F"].includes(clean)) return ["USD"];
  if (clean.endsWith("-USD")) return ["USD"];
  if (clean.startsWith("^") || /^[A-Z]{1,5}$/.test(clean) || ["us", "healthcare"].includes(marketId)) return ["USD"];
  return [];
}

function buildCalendarSummary(upcoming, hotEvents, nextHighImpact) {
  if (hotEvents.length) {
    return `خبر عالي التأثير قريب: ${hotEvents[0].currency} - ${hotEvents[0].title}`;
  }

  if (nextHighImpact) {
    return `راقب الخبر العالي القادم: ${nextHighImpact.currency} - ${nextHighImpact.title} (${nextHighImpact.localTimeLabel})`;
  }

  if (upcoming.length) {
    return `لا توجد أخبار عالية قريبة، أقرب حدث: ${upcoming[0].currency} - ${upcoming[0].title}`;
  }

  return "لا توجد أحداث اقتصادية مؤثرة قريبة حسب الرزنامة المتاحة.";
}

function applyEconomicNewsOverlay(item, marketId, events) {
  const currencies = new Set(getSymbolCurrencies(item.symbol, marketId));
  const relevantEvents = events
    .filter((event) => currencies.has(event.currency))
    .map((event) => ({
      ...event,
      minutesToEvent: Math.round((event.timestamp - Date.now()) / 60_000)
    }))
    .sort((a, b) => {
      const impactRank = { high: 0, medium: 1, low: 2 };
      return impactRank[a.impact] - impactRank[b.impact] || Math.abs(a.minutesToEvent) - Math.abs(b.minutesToEvent);
    })
    .slice(0, 5);
  const newsRisk = buildNewsRisk(relevantEvents, item, marketId);

  if (newsRisk.level === "clear") {
    return { ...item, economicNewsRisk: newsRisk };
  }

  const reasons = Array.isArray(item.reasons) ? item.reasons : [];
  const next = {
    ...item,
    economicNewsRisk: newsRisk,
    reasons: uniqueReasons([newsRisk.summary, ...reasons]).slice(0, 6)
  };

  if (newsRisk.blockTrading && item.action !== "hold") {
    return {
      ...next,
      setupAction: item.action,
      setupActionLabel: item.actionLabel,
      action: "hold",
      actionLabel: "انتظار",
      confidence: Math.min(Number(item.confidence || 0), 58),
      duration: "انتظار حتى يهدأ تأثير الخبر ثم إعادة قراءة الشارت",
      decision: item.decision
        ? {
            ...item.decision,
            badge: "انتظار",
            summary: newsRisk.summary
          }
        : item.decision
    };
  }

  return {
    ...next,
    confidence: Math.min(Number(item.confidence || 0), newsRisk.confidenceCap)
  };
}

function buildClearNewsRisk(item, marketId) {
  return {
    level: "clear",
    label: "الأخبار هادئة",
    score: 0,
    blockTrading: false,
    confidenceCap: Number(item?.confidence || 92),
    summary: "لا توجد أخبار اقتصادية مؤثرة قريبة على هذا الرمز.",
    currencies: getSymbolCurrencies(item?.symbol, marketId),
    events: []
  };
}

function buildNewsRisk(events, item, marketId) {
  const highBlock = events.find((event) => (
    event.impact === "high" &&
    event.minutesToEvent >= -HIGH_IMPACT_BLOCK_AFTER_MIN &&
    event.minutesToEvent <= HIGH_IMPACT_BLOCK_BEFORE_MIN
  ));
  const highWatch = events.find((event) => event.impact === "high" && event.minutesToEvent >= 0 && event.minutesToEvent <= HIGH_IMPACT_WATCH_MIN);
  const mediumWatch = events.find((event) => event.impact === "medium" && event.minutesToEvent >= 0 && event.minutesToEvent <= MEDIUM_IMPACT_WATCH_MIN);
  const main = highBlock || highWatch || mediumWatch;

  if (!main) return buildClearNewsRisk(item, marketId);

  if (highBlock) {
    return {
      level: "danger",
      label: "خبر عالي التأثير",
      score: 100,
      blockTrading: true,
      confidenceCap: 58,
      summary: `خبر عالي التأثير على ${main.currency}: ${main.title} (${formatMinutesToEvent(main.minutesToEvent)}). الأفضل انتظار ما بعد الخبر.`,
      currencies: getSymbolCurrencies(item.symbol, marketId),
      events
    };
  }

  if (highWatch) {
    return {
      level: "watch",
      label: "راقب خبر عالي",
      score: 72,
      blockTrading: false,
      confidenceCap: 68,
      summary: `يوجد خبر عالي على ${main.currency}: ${main.title} خلال ${formatMinutesToEvent(main.minutesToEvent)}؛ تم خفض الثقة ورفع الحذر.`,
      currencies: getSymbolCurrencies(item.symbol, marketId),
      events
    };
  }

  return {
    level: "watch",
    label: "خبر متوسط",
    score: 46,
    blockTrading: false,
    confidenceCap: 74,
    summary: `يوجد خبر متوسط على ${main.currency}: ${main.title} خلال ${formatMinutesToEvent(main.minutesToEvent)}؛ راقب التذبذب.`,
    currencies: getSymbolCurrencies(item.symbol, marketId),
    events
  };
}

function formatMinutesToEvent(minutes) {
  const abs = Math.abs(Number(minutes || 0));
  if (minutes < 0) {
    return abs < 60 ? `منذ ${abs} دقيقة` : `منذ ${Math.round(abs / 60)} ساعة`;
  }
  return abs < 60 ? `${abs} دقيقة` : `${Math.round(abs / 60)} ساعة`;
}

function uniqueReasons(reasons = []) {
  return [...new Set(reasons.filter(Boolean))];
}
