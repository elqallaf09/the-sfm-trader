import { toNullableNumber } from "../public/modules/numberValue.js";

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
export function finalizeRecommendation(item, { currency, executionMarketId, session }) {
  const enriched = { ...item, currency, executionMarketId, executionSession: session || null };
  return session?.isOpen === false ? applyClosedMarketGuard(enriched, session) : enriched;
}
