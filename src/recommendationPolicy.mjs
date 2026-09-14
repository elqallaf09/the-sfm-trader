import { toNullableNumber } from "../public/modules/numberValue.js";

const FAST_FRAME_MAX_AGE_MS = Object.freeze({
  "1m": 10 * 60 * 1000,
  "15m": 45 * 60 * 1000,
  "30m": 90 * 60 * 1000,
  "1h": 150 * 60 * 1000
});
const FAST_FRAME_PRIORITY = ["1m", "15m", "30m", "1h"];

export function applyClosedMarketGuard(item, session) {
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
    setupAction: item.setupAction || item.action,
    setupActionLabel: item.setupActionLabel || item.actionLabel,
    action: "hold",
    actionLabel: "انتظار",
    confidence: toNullableNumber(item.confidence) === null ? null : Math.min(toNullableNumber(item.confidence), 62),
    duration: session.openAt ? `مراقبة حتى افتتاح السوق: ${nextOpen} بتوقيت ${session.label}` : "مراقبة حتى افتتاح السوق",
    marketClosed: true,
    marketSession: session,
    reasons: [
      "السوق مغلق الآن؛ لا توجد توصية دخول فورية قبل عودة التداول.",
      ...reasons.filter(Boolean)
    ].slice(0, 6),
    decision: item.decision
      ? {
          ...item.decision,
          kind: "hold",
          badge: "انتظار",
          title: "السوق مغلق",
          message: "السوق مغلق الآن؛ راقب الإشارة عند الافتتاح.",
          summary: "السوق مغلق الآن؛ راقب الإشارة عند الافتتاح ولا تدخل قبل ظهور أسعار حية."
        }
      : item.decision
  };
}

export function resolveTrustedCurrency(symbol, providerCurrency, fallbackCurrency = "") {
  const upper = String(symbol || "").trim().toUpperCase();
  const provider = normalizeCurrency(providerCurrency);
  const fallback = normalizeCurrency(fallbackCurrency);

  if (upper.endsWith("=X")) return "PAIR";
  if (upper.includes("-USD") || upper.endsWith("=F")) return "USD";
  if (upper.endsWith(".KW")) return "KWD";
  if (upper.endsWith(".SR")) return "SAR";
  if (upper.endsWith(".AE") || upper.endsWith(".AD") || upper.endsWith(".DU")) return "AED";
  if (upper.endsWith(".QA")) return "QAR";
  if (upper.endsWith(".BH")) return "BHD";
  if (upper.endsWith(".OM")) return "OMR";
  if (upper.endsWith(".SW")) return "CHF";
  if (upper.endsWith(".HK")) return "HKD";
  if (upper.endsWith(".KS")) return "KRW";
  if (upper.endsWith(".T")) return "JPY";
  if (upper.endsWith(".L")) return provider === "GBX" ? "GBX" : provider === "GBP" ? "GBP" : "GBX";
  if (upper.endsWith(".AS") || upper.endsWith(".DE") || upper.endsWith(".PA")) return "EUR";

  return provider || fallback || "USD";
}

export function getFastPriceFreshness(item, now = Date.now()) {
  const frames = Array.isArray(item?.timeframes) ? item.timeframes : [];
  const candidates = frames
    .filter((frame) => FAST_FRAME_PRIORITY.includes(frame?.id))
    .map((frame) => {
      const timestampSeconds = Number(frame?.latestTimestamp || 0);
      const timestampMs = Number.isFinite(timestampSeconds) && timestampSeconds > 0 ? timestampSeconds * 1000 : NaN;
      const maxAgeMs = FAST_FRAME_MAX_AGE_MS[frame.id];
      const ageMs = Number.isFinite(timestampMs) ? Math.max(0, now - timestampMs) : null;
      return {
        id: frame.id,
        label: frame.label || frame.id,
        timestampMs,
        marketTimestamp: Number.isFinite(timestampMs) ? new Date(timestampMs).toISOString() : null,
        ageMs,
        maxAgeMs,
        current: Number.isFinite(ageMs) && ageMs <= maxAgeMs
      };
    })
    .filter((frame) => Number.isFinite(frame.timestampMs))
    .sort((a, b) => {
      if (a.current !== b.current) return a.current ? -1 : 1;
      if (a.timestampMs !== b.timestampMs) return b.timestampMs - a.timestampMs;
      return FAST_FRAME_PRIORITY.indexOf(a.id) - FAST_FRAME_PRIORITY.indexOf(b.id);
    });

  const best = candidates[0] || null;
  if (!best) {
    return {
      state: "unknown",
      frame: null,
      marketTimestamp: null,
      ageSeconds: null,
      maxAgeSeconds: null,
      reason: "fast-frame-missing"
    };
  }

  return {
    state: best.current ? "current" : "stale",
    frame: best.id,
    frameLabel: best.label,
    marketTimestamp: best.marketTimestamp,
    ageSeconds: Math.round(best.ageMs / 1000),
    maxAgeSeconds: Math.round(best.maxAgeMs / 1000),
    reason: best.current ? "fast-frame-current" : "fast-frame-stale"
  };
}

export function applyOpenMarketFreshnessGuard(item, session, now = Date.now()) {
  if (!session?.isOpen || !["buy", "sell"].includes(item.action)) return item;

  // Runtime analysis always supplies provenance and timeframe timestamps. Legacy/unit
  // callers without provenance remain unchanged instead of being silently reclassified.
  if (!item.dataProvenance || typeof item.dataProvenance !== "object") return item;

  const provenance = item.dataProvenance;
  const primaryExplicitlyStale = provenance.freshness === "stale";
  const freshness = getFastPriceFreshness(item, now);
  const blocked = primaryExplicitlyStale || freshness.state !== "current";

  if (!blocked) {
    return {
      ...item,
      priceFreshness: {
        ...freshness,
        retrievedAt: provenance.retrievedAt || null,
        primaryMarketTimestamp: provenance.marketTimestamp || null
      }
    };
  }

  const reasons = Array.isArray(item.reasons) ? item.reasons : [];
  const message = primaryExplicitlyStale
    ? "مسار السعر الأساسي مصنف stale، لذلك تم منع إشارة الدخول أثناء السوق المفتوح."
    : freshness.state === "unknown"
      ? "لا يوجد فريم سريع موثوق بوقت سوق صالح، لذلك تم منع إشارة الدخول أثناء السوق المفتوح."
      : `أحدث فريم سريع (${freshness.frameLabel || freshness.frame}) تجاوز حد حداثته، لذلك تم منع إشارة الدخول.`;

  return {
    ...item,
    setupAction: item.setupAction || item.action,
    setupActionLabel: item.setupActionLabel || item.actionLabel,
    action: "hold",
    actionLabel: "انتظار",
    confidence: toNullableNumber(item.confidence) === null ? null : Math.min(toNullableNumber(item.confidence), 58),
    stalePriceBlocked: true,
    priceFreshness: {
      ...freshness,
      state: primaryExplicitlyStale ? "stale" : freshness.state,
      retrievedAt: provenance.retrievedAt || null,
      primaryMarketTimestamp: provenance.marketTimestamp || null
    },
    reasons: [message, ...reasons.filter(Boolean)].slice(0, 6),
    decision: {
      ...(item.decision || {}),
      kind: "hold",
      badge: "انتظار",
      title: "السعر غير حديث بما يكفي",
      message,
      summary: message
    }
  };
}

export function finalizeRecommendation(item, { currency, executionMarketId, session }) {
  const enriched = {
    ...item,
    currency: resolveTrustedCurrency(item.symbol, item.currency, currency),
    executionMarketId,
    executionSession: session || null
  };
  if (session?.isOpen === false) return applyClosedMarketGuard(enriched, session);
  return applyOpenMarketFreshnessGuard(enriched, session);
}

function normalizeCurrency(currency) {
  const raw = String(currency || "").trim();
  if (raw === "GBp" || raw.toLowerCase() === "gbpence") return "GBX";
  const code = raw.toUpperCase();
  return {
    KWF: "KWD",
    KW: "KWD"
  }[code] || code;
}
