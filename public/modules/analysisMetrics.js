import { toNullableNumber } from "./numberValue.js?v=20260914-audit-repair-1";

// One scoring formula and presentation contract for Home, cards and detail pages.
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const numberOr = (value, fallback = 0) => toNullableNumber(value) ?? fallback;

export function calculateFinalScore(item = {}) {
  const confidencePoints = clamp(numberOr(item.confidence), 0, 100) * 0.31;
  const agreementPoints = clamp(numberOr(item.timeframeConsensus?.agreementPct), 0, 100) * 0.14;
  const dataHealthPoints = clamp(numberOr(item.dataHealth?.score), 0, 100) * 0.1;
  const shariaPoints = {
    compliant: 20,
    doubtful: 8,
    unknown: 4,
    not_compliant: 0
  }[item.shariaStatus] ?? 4;
  const riskPoints = {
    low: 15,
    medium: 9,
    high: 3
  }[item.risk?.level] ?? 8;
  const winRate = toNullableNumber(item.backtest?.winRate);
  const backtestPoints = Number.isFinite(winRate) ? clamp(winRate * 0.1, 0, 10) : 4;
  const movePoints = clamp(Math.abs(numberOr(item.expectedMovePct)) * 1.2, 0, 5);
  const qualityPoints = clamp(numberOr(item.analysisQuality?.score), 0, 100) * 0.07;
  const riskRewardPoints = clamp(numberOr(item.riskReward), 0, 3) * 2;
  const conflictPenalty = item.timeframeConsensus?.conflict ? 8 : 0;
  const lowDataPenalty = numberOr(item.dataHealth?.score, 100) < 55 ? 7 : 0;
  const score = Math.round(clamp(confidencePoints + agreementPoints + dataHealthPoints + shariaPoints + riskPoints + backtestPoints + movePoints + qualityPoints + riskRewardPoints - conflictPenalty - lowDataPenalty, 0, 100));
  const label = score >= 80 ? "قوي جداً" : score >= 70 ? "قوي" : score >= 55 ? "متوسط" : "ضعيف";

  return { score, label };
}

function percentage(value) {
  if (!["number", "string"].includes(typeof value) || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= 100 ? number : null;
}

export function getAnalysisMetrics(item = {}, { english = false, localize = String } = {}) {
  const unavailable = english ? "Unavailable" : "غير متاح";
  const confidence = percentage(item.confidence);
  const computed = confidence === null ? null : percentage(calculateFinalScore(item).score);
  const duration = typeof item.duration === "string" && item.duration.trim()
    ? localize(item.duration.trim()) : unavailable;
  return {
    unavailable,
    target: [item.target1, item.tradePlan?.target1, item.expectedPrice, item.target, item.priceTarget]
      .map(toNullableNumber)
      .find(value => Number.isFinite(value) && value > 0) ?? null,
    confidence,
    confidenceText: confidence === null ? unavailable : String(Math.round(confidence)) + "%",
    confidenceRingText: confidence === null ? "--" : String(Math.round(confidence)) + "%",
    duration,
    score: computed,
    scoreText: computed === null ? unavailable : String(Math.round(computed)) + " / 100",
    confidenceLabel: english ? "Confidence" : "الثقة",
    durationLabel: english ? "Expected duration" : "المدة المتوقعة",
    scoreLabel: english ? "AI score" : "تقييم AI",
    scoreDescription: english ? "Composite analysis score out of 100" : "تقييم التحليل المركب من 100"
  };
}

export function getRecommendationAction(item = {}) {
  const raw = String(item.action || item.recommendationAction || "").trim().toLowerCase();
  if (["buy", "شراء"].includes(raw)) return "buy";
  if (["sell", "بيع"].includes(raw)) return "sell";
  if (["hold", "انتظار", "wait", "watch"].includes(raw)) return "hold";
  if (["avoid", "مراقبة"].includes(raw)) return "watch";
  return "pending";
}
