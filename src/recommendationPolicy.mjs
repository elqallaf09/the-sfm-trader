import { resolveQuoteCurrency, epochSecondsToMs, isoTimestampMs } from "../public/modules/marketIntegrity.js";
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
    executionBlocked: true,
    priceFreshness: { state:"closed", marketTimestamp:item.dataProvenance?.marketTimestamp || null, retrievedAt:item.dataProvenance?.retrievedAt || null },
    tradePlan:item.tradePlan ? {...item.tradePlan,action:"hold",executionBlocked:true,note:"السوق مغلق؛ خطة للمراقبة فقط"} : item.tradePlan,
    marketSession: session,
    reasons: [
      "السوق مغلق الآن؛ لا توجد توصية دخول فورية قبل عودة التداول.",
      ...reasons.filter(Boolean)
    ].slice(0, 6),
    decision: {
          ...item.decision,
          kind: "hold",
          badge: "انتظار",
          title: "السوق مغلق",
          message: "السوق مغلق الآن؛ راقب الإشارة عند الافتتاح.",
          summary: "السوق مغلق الآن؛ راقب الإشارة عند الافتتاح ولا تدخل قبل ظهور أسعار حية."
        }
  };
}

export function resolveTrustedCurrency(symbol, providerCurrency, fallbackCurrency = "") {
  return resolveQuoteCurrency(symbol, providerCurrency, fallbackCurrency);
}

export function getFastPriceFreshness(item, now = Date.now()) {
  const frames = Array.isArray(item?.timeframes) ? item.timeframes : [];
  const candidates = frames
    .filter((frame) => FAST_FRAME_PRIORITY.includes(frame?.id))
    .map((frame) => {
      const parsedMs = epochSecondsToMs(frame?.latestTimestamp);
      const timestampMs = parsedMs !== null && parsedMs <= now + 120000 ? parsedMs : NaN;
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
  const provenance = item.dataProvenance || {};
  const timestampMs = isoTimestampMs(provenance.marketTimestamp);
  const invalid = timestampMs === null || timestampMs > now + 120000 || !(toNullableNumber(item.currentPrice) > 0);
  const ageMs = invalid ? null : Math.max(0, now - timestampMs);
  // A fresh unrelated frame must not authenticate an old primary price. The
  // exact price observation carries its own timestamp, kind and interval.
  const maxAgeMs = provenance.priceKind === "quote" ? 20 * 60000
    : provenance.priceKind === "bar-close" ? FAST_FRAME_MAX_AGE_MS[provenance.priceInterval] : null;
  const state = invalid || !maxAgeMs ? "unknown"
    : provenance.freshness === "stale" || ageMs > maxAgeMs ? "stale" : "current";
  const freshness = {
    state, marketTimestamp: provenance.marketTimestamp || null,
    retrievedAt: provenance.retrievedAt || null,
    primaryMarketTimestamp: provenance.marketTimestamp || null,
    frame: provenance.priceInterval || null, priceKind: provenance.priceKind || null,
    ageSeconds: ageMs === null ? null : Math.round(ageMs/1000),
    maxAgeSeconds: maxAgeMs ? maxAgeMs/1000 : null,
    reason: invalid ? "price-time-invalid" : !maxAgeMs ? "price-observation-unverified" : state === "stale" ? "price-stale" : "price-current"
  };
  const enriched = {...item, priceFreshness:freshness, dataProvenance:{...provenance, freshness:state}};
  if (session?.isOpen === true && state === "current") return enriched;
  const message = session?.isOpen !== true
    ? "حالة جلسة التداول غير مؤكدة؛ المراقبة فقط حتى التحقق من افتتاح السوق."
    : "توقيت السعر الأساسي غير صالح أو قديم؛ لا توجد إشارة دخول حتى وصول سعر موثوق وحديث.";
  const confidence = toNullableNumber(item.confidence);
  return {
    ...enriched, setupAction:item.setupAction || item.action,
    setupActionLabel:item.setupActionLabel || item.actionLabel,
    action:"hold", actionLabel:"انتظار", executionBlocked:true,
    stalePriceBlocked:state !== "current", confidence:confidence === null ? null : Math.min(confidence,58),
    duration:"مراقبة حتى وصول سعر حديث وتأكيد جلسة التداول",
    tradePlan:item.tradePlan ? {...item.tradePlan, action:"hold", executionBlocked:true, note:message} : item.tradePlan,
    reasons:[message,...(Array.isArray(item.reasons) ? item.reasons : []).filter(Boolean)].slice(0,6),
    decision:{...(item.decision || {}),kind:"hold",badge:"انتظار",title:"التنفيذ غير متاح",message,summary:message,
      evidence:{...(item.decision?.evidence || {}),confidence:confidence===null ? null : Math.min(confidence,58)}}
  };
}

export function finalizeRecommendation(item, { currency, executionMarketId, session, now = Date.now() } = {}) {
  if (["CLOSED", "PRE", "POST", "PREPRE", "POSTPOST"].includes(String(item.marketState || "").toUpperCase())) {
    session = {...(session || {}), isOpen:false, source:"provider"};
  }
  const enriched = {
    ...item,
    currency: resolveTrustedCurrency(item.symbol, item.currency, currency),
    executionMarketId,
    executionSession: session || null
  };
  if (session?.isOpen === false) return applyClosedMarketGuard(enriched, session);
  return applyOpenMarketFreshnessGuard(enriched, session, now);
}
