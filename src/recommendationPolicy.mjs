import { toNullableNumber } from "../public/modules/numberValue.js";

const OPEN_MARKET_MAX_PRICE_AGE_MS = 45 * 60 * 1000;

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
      `السوق مغلق الآن؛ لا توجد توصية دخول فورية قبل عودة التداول.`,
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

export function applyOpenMarketFreshnessGuard(item, session, now = Date.now()) {
  if (!session?.isOpen || !["buy", "sell"].includes(item.action)) return item;

  // Runtime analysis always supplies provenance. Legacy/unit callers without that
  // contract remain unchanged; a present-but-incomplete provenance fails closed.
  if (!item.dataProvenance || typeof item.dataProvenance !== "object") return item;

  const provenance = item.dataProvenance;
  const timestampMs = Date.parse(provenance.marketTimestamp || "");
  const ageMs = Number.isFinite(timestampMs) ? Math.max(0, now - timestampMs) : null;
  const explicitlyStale = provenance.freshness === "stale";
  const missingTimestamp = !Number.isFinite(timestampMs);
  const tooOld = Number.isFinite(ageMs) && ageMs > OPEN_MARKET_MAX_PRICE_AGE_MS;

  if (!explicitlyStale && !missingTimestamp && !tooOld) {
    return {
      ...item,
      priceFreshness: {
        state: "current",
        marketTimestamp: provenance.marketTimestamp,
        ageSeconds: Math.round(ageMs / 1000),
        maxAgeSeconds: Math.round(OPEN_MARKET_MAX_PRICE_AGE_MS / 1000)
      }
    };
  }

  const reasons = Array.isArray(item.reasons) ? item.reasons : [];
  const message = missingTimestamp
    ? "لا يوجد توقيت سوق موثوق للسعر الحالي، لذلك تم منع إشارة الدخول أثناء السوق المفتوح."
    : explicitlyStale
      ? "السعر الأساسي مصنف stale من مسار البيانات، لذلك تم منع إشارة الدخول أثناء السوق المفتوح."
      : `عمر السعر تجاوز ${Math.round(OPEN_MARKET_MAX_PRICE_AGE_MS / 60000)} دقيقة أثناء السوق المفتوح، لذلك تم منع إشارة الدخول.`;

  return {
    ...item,
    setupAction: item.setupAction || item.action,
    setupActionLabel: item.setupActionLabel || item.actionLabel,
    action: "hold",
    actionLabel: "انتظار",
    confidence: toNullableNumber(item.confidence) === null ? null : Math.min(toNullableNumber(item.confidence), 58),
    stalePriceBlocked: true,
    priceFreshness: {
      state: missingTimestamp ? "unknown" : "stale",
      marketTimestamp: provenance.marketTimestamp || null,
      ageSeconds: Number.isFinite(ageMs) ? Math.round(ageMs / 1000) : null,
      maxAgeSeconds: Math.round(OPEN_MARKET_MAX_PRICE_AGE_MS / 1000)
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
