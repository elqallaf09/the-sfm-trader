import { fetchChart } from "./dataProviders.mjs";

const TIMEFRAME_CONFIGS = [
  { id: "1m", label: "دقيقة", range: "1d", interval: "1m", weight: 0.06, minBars: 25 },
  { id: "15m", label: "15 دقيقة", range: "5d", interval: "15m", weight: 0.08, minBars: 25 },
  { id: "30m", label: "30 دقيقة", range: "1mo", interval: "30m", weight: 0.09, minBars: 35 },
  { id: "1h", label: "ساعة", range: "3mo", interval: "60m", weight: 0.12, minBars: 35 },
  { id: "1d", label: "يومي", range: "1y", interval: "1d", weight: 0.25, minBars: 50 },
  { id: "1wk", label: "أسبوعي", range: "5y", interval: "1wk", weight: 0.17, minBars: 50 },
  { id: "1mo", label: "شهري", range: "5y", interval: "1mo", weight: 0.13, minBars: 35 },
  { id: "1y", label: "سنوي", range: "10y", interval: "1mo", weight: 0.1, minBars: 60 }
];
const TIMEFRAME_FIRST_PASS_MS = Number(process.env.TIMEFRAME_FIRST_PASS_MS || 4_000);

// وضع الدقة العالية: لا تُنشر إشارة شراء/بيع إلا إذا أثبت الاختبار الخلفي
// أن نفس الإعداد على نفس الرمز أصاب الهدف الأول بنسبة >= PRECISION_MIN_WINRATE.
const PRECISION_MIN_WINRATE = clampEnv("PRECISION_MIN_WINRATE", 90, 50, 99);
const PRECISION_MIN_SAMPLES = clampEnv("PRECISION_MIN_SAMPLES", 8, 3, 60);
const TP1_ATR_MULTIPLE = 0.9;   // هدف أول قريب = احتمال إصابة مرتفع
const TP2_ATR_MULTIPLE = 2.2;   // هدف ثاني للسوينق
const SL_ATR_MULTIPLE = 1.8;    // وقف واسع خلف الهيكل السعري
const BACKTEST_HORIZON = 15;    // عدد الشموع لمحاكاة أول ملامسة

function clampEnv(name, fallback, min, max) {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}
const PRIMARY_TIMEFRAME_IDS = new Set(["15m", "1h", "1d", "1wk"]);
const FAST_MARKET_TIMEFRAME_IDS = new Set(["1d"]);

export async function analyzeSymbol(asset, options = {}) {
  const timeframeAnalyses = await fetchTimeframeAnalyses(asset.symbol, options);
  const primaryFrame = pickPrimaryFrame(timeframeAnalyses);

  if (!primaryFrame) {
    throw new Error("بيانات غير كافية للتحليل");
  }

  const meta = primaryFrame.meta || {};
  const closes = primaryFrame.closes;
  const highs = primaryFrame.highs;
  const lows = primaryFrame.lows;
  const volumes = primaryFrame.volumes;
  const latestVolume = finiteOr(volumes.at(-1), 0);
  const currentPrice = pickValidPrice(meta.regularMarketPrice, primaryFrame.currentPrice, closes.at(-1));
  const indicators = primaryFrame.indicators;
  const dataHealth = buildDataHealth(timeframeAnalyses, primaryFrame, currentPrice);
  const backtest = backtestSignals(closes, highs, lows, volumes);
  let recommendation = calibrateRecommendation(scoreMultiTimeframe(timeframeAnalyses), timeframeAnalyses, dataHealth);
  recommendation = applyPrecisionGate(recommendation, backtest);
  let expectedPrice = projectPrice(currentPrice, indicators, recommendation.score, recommendation.action, timeframeAnalyses);
  let tradePlan = buildTradePlan(currentPrice, expectedPrice, indicators, recommendation, timeframeAnalyses);
  recommendation = applyExecutionGate(recommendation, tradePlan, dataHealth);
  expectedPrice = projectPrice(currentPrice, indicators, recommendation.score, recommendation.action, timeframeAnalyses);
  tradePlan = buildTradePlan(currentPrice, expectedPrice, indicators, recommendation, timeframeAnalyses);
  const risk = buildRiskProfile(indicators, recommendation.score, recommendation.agreementPct);
  const analysisQuality = buildAnalysisQuality(timeframeAnalyses, recommendation, indicators, backtest, dataHealth);
  const decision = buildDecisionSummary(recommendation, risk, tradePlan, analysisQuality, dataHealth);

  return {
    symbol: asset.symbol,
    name: asset.name,
    shariaStatus: asset.shariaStatus || "unknown",
    shariaLabel: asset.shariaLabel || "",
    shariaSource: asset.shariaSource || getDefaultShariaSource(asset.shariaStatus),
    shariaCheckedAt: asset.shariaCheckedAt || new Date().toISOString().slice(0, 7),
    exchangeName: meta.exchangeName || meta.fullExchangeName || "",
    currency: normalizeCurrencyCode(meta.currency || inferCurrencyFromSymbol(asset.symbol)),
    dataProvider: meta.dataProvider || "Yahoo Finance",
    currentPrice,
    expectedPrice,
    target1: tradePlan.target1,
    target2: tradePlan.target2,
    stopLoss: tradePlan.stopLoss,
    entryPrice: tradePlan.entryPrice,
    support: tradePlan.support,
    resistance: tradePlan.resistance,
    riskReward: tradePlan.riskReward,
    tradePlan,
    dataHealth,
    expectedMovePct: pctChange(currentPrice, expectedPrice),
    confidence: recommendation.confidence,
    action: recommendation.action,
    actionLabel: recommendation.actionLabel,
    duration: recommendation.duration,
    updatedAt: new Date().toISOString(),
    marketState: meta.marketState || "",
    latestVolume,
    averageVolume20: round(indicators.averageVolume20, 2),
    averageVolume50: round(indicators.averageVolume50, 2),
    relativeVolume: round(indicators.relativeVolume, 2),
    providerDelayNote: meta.exchangeTimezoneShortName ? `توقيت السوق: ${meta.exchangeTimezoneShortName}` : "",
    reasons: recommendation.reasons,
    score: round(recommendation.score, 2),
    timeframeConsensus: {
      agreementPct: recommendation.agreementPct,
      coverage: timeframeAnalyses.length,
      total: TIMEFRAME_CONFIGS.length,
      bias: recommendation.bias,
      conflict: recommendation.conflict,
      dataHealthScore: dataHealth.score,
      dataHealthLabel: dataHealth.label
    },
    timeframes: timeframeAnalyses.map((frame) => ({
      id: frame.id,
      label: frame.label,
      action: frame.signal.action,
      actionLabel: frame.signal.actionLabel,
      confidence: frame.signal.confidence,
      score: round(frame.signal.score, 2),
      barCount: frame.closes.length,
      latestTimestamp: frame.latestTimestamp || null,
      rsi14: round(frame.indicators.rsi14, 2),
      momentum20: round(frame.indicators.momentum20 * 100, 2),
      trend: frame.indicators.sma20 >= frame.indicators.sma50 ? "صاعد" : "هابط",
      vwap: round(frame.indicators.vwap, getPrecision(frame.indicators.vwap || currentPrice)),
      relativeVolume: round(frame.indicators.relativeVolume, 2)
    })),
    risk,
    backtest,
    precisionMode: recommendation.precision || null,
    analysisQuality,
    decision,
    sparkline: buildSparkline(closes, 36),
    upsideOutlook: buildUpsideOutlook(currentPrice, indicators, recommendation.score),
    indicators: {
      rsi14: round(indicators.rsi14, 2),
      sma20: round(indicators.sma20, 4),
      sma50: round(indicators.sma50, 4),
      macd: round(indicators.macd, 4),
      macdSignal: round(indicators.macdSignal, 4),
      momentum20: round(indicators.momentum20 * 100, 2),
      volatility20: round(indicators.volatility20 * 100, 2),
      volumeTrend: round(indicators.volumeTrend * 100, 2),
      atr14: round(indicators.atr14, getPrecision(currentPrice)),
      vwap: round(indicators.vwap, getPrecision(currentPrice)),
      support: tradePlan.support,
      resistance: tradePlan.resistance,
      latestVolume: round(latestVolume, 2),
      averageVolume20: round(indicators.averageVolume20, 2),
      relativeVolume: round(indicators.relativeVolume, 2),
      volumePower: indicators.relativeVolume >= 1.4 ? "مرتفع" : indicators.relativeVolume >= 0.8 ? "طبيعي" : "ضعيف"
    }
  };
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
  return "USD";
}

async function fetchTimeframeAnalyses(symbol, options = {}) {
  const frames = [];
  let acceptingFrames = true;
  const firstPassMs = Number(options.maxWaitMs || TIMEFRAME_FIRST_PASS_MS);
  const primaryConfigs = TIMEFRAME_CONFIGS.filter((config) => (
    options.fast ? FAST_MARKET_TIMEFRAME_IDS.has(config.id) : PRIMARY_TIMEFRAME_IDS.has(config.id)
  ));
  const remainingConfigs = TIMEFRAME_CONFIGS.filter((config) => !PRIMARY_TIMEFRAME_IDS.has(config.id));

  const fetchFrame = async (config) => {
    try {
      const chart = await fetchChart(symbol, {
        range: config.range,
        interval: config.interval,
        includePrePost: false
      });
      const frame = buildTimeframeAnalysis(config, chart);
      if (frame && acceptingFrames) frames.push(frame);
    } catch {
      // بعض الأسواق لا توفر كل الفريمات اللحظية؛ نستخدم المتاح فقط.
    }
  };

  await Promise.race([
    Promise.allSettled(primaryConfigs.map(fetchFrame)),
    wait(firstPassMs)
  ]);

  if (!options.fast && frames.length) {
    await Promise.race([
      Promise.allSettled(remainingConfigs.map(fetchFrame)),
      wait(firstPassMs)
    ]);
  }

  acceptingFrames = false;

  if (!frames.length) {
    const fallbackChart = await fetchChart(symbol);
    const fallbackFrame = buildTimeframeAnalysis(
      { id: "1d", label: "يومي", range: "6mo", interval: "1d", weight: 1, minBars: 35 },
      fallbackChart
    );
    if (fallbackFrame) frames.push(fallbackFrame);
  }

  frames.sort((a, b) => TIMEFRAME_CONFIGS.findIndex((item) => item.id === a.id) - TIMEFRAME_CONFIGS.findIndex((item) => item.id === b.id));
  return frames;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildTimeframeAnalysis(config, chart) {
  const result = chart.chart?.result?.[0];
  if (!result) return null;

  const meta = result.meta || {};
  const quote = result.indicators?.quote?.[0] || {};
  const rows = (quote.close || [])
    .map((close, index) => ({
      timestamp: Number(result.timestamp?.[index] ?? 0),
      close: Number(close),
      high: Number(quote.high?.[index] ?? close),
      low: Number(quote.low?.[index] ?? close),
      volume: Number(quote.volume?.[index] ?? 0)
    }))
    .filter((row) => row.close > 0 && row.high > 0 && row.low > 0);

  if (rows.length < config.minBars) return null;

  const closes = rows.map((row) => row.close);
  const highs = rows.map((row) => row.high);
  const lows = rows.map((row) => row.low);
  const volumes = rows.map((row) => Number.isFinite(row.volume) ? row.volume : 0);
  const timestamps = rows.map((row) => row.timestamp).filter((timestamp) => Number.isFinite(timestamp) && timestamp > 0);
  const latestTimestamp = timestamps.at(-1) || 0;
  const currentPrice = pickValidPrice(meta.regularMarketPrice, closes.at(-1));

  if (!Number.isFinite(currentPrice) || currentPrice <= 0) return null;

  const indicators = buildIndicators(closes, highs, lows, volumes, currentPrice);
  const signal = scoreSignal(indicators);

  return {
    ...config,
    meta,
    currentPrice,
    closes,
    highs,
    lows,
    volumes,
    timestamps,
    latestTimestamp,
    indicators,
    signal
  };
}

function buildDataHealth(frames, primaryFrame, currentPrice) {
  const prices = frames.map((frame) => Number(frame.currentPrice)).filter((price) => Number.isFinite(price) && price > 0);
  const minPrice = prices.length ? Math.min(...prices) : currentPrice;
  const maxPrice = prices.length ? Math.max(...prices) : currentPrice;
  const midPrice = (maxPrice + minPrice) / 2 || currentPrice || 1;
  const priceDispersionPct = midPrice > 0 ? ((maxPrice - minPrice) / midPrice) * 100 : 0;
  const freshness = frames.map(getFrameFreshness);
  const staleFrames = freshness.filter((item) => item.isStale).map((item) => item.frame.label);
  const depthItems = frames.map((frame) => {
    const config = TIMEFRAME_CONFIGS.find((item) => item.id === frame.id) || frame;
    const required = Math.max(1, Number(config.minBars || 35));
    const score = clamp((frame.closes.length / (required * 1.55)) * 100, 0, 100);
    return { frame, score, required };
  });
  const lowDepthFrames = depthItems.filter((item) => item.score < 58).map((item) => item.frame.label);
  const coverageScore = clamp((frames.length / TIMEFRAME_CONFIGS.length) * 100, 0, 100);
  const depthScore = average(depthItems.map((item) => item.score), 0);
  const freshnessScore = average(freshness.map((item) => item.score), 55);
  const consistencyScore = prices.length < 2 ? 70 : clamp(100 - priceDispersionPct * 14, 0, 100);
  const score = Math.round(clamp(
    coverageScore * 0.24 +
      depthScore * 0.24 +
      freshnessScore * 0.22 +
      consistencyScore * 0.3,
    0,
    100
  ));
  const availableIds = new Set(frames.map((frame) => frame.id));
  const notes = [
    `تغطية الفريمات ${frames.length}/${TIMEFRAME_CONFIGS.length}`,
    `تفاوت السعر بين الفريمات ${round(priceDispersionPct, 2)}%`
  ];

  if (staleFrames.length) notes.push(`بيانات قديمة: ${staleFrames.slice(0, 3).join("، ")}`);
  if (lowDepthFrames.length) notes.push(`عمق بيانات ضعيف: ${lowDepthFrames.slice(0, 3).join("، ")}`);
  if (!availableIds.has("1d")) notes.push("الفريم اليومي غير متاح، لذلك الثقة محدودة");
  if (!["1m", "15m", "30m"].some((id) => availableIds.has(id))) notes.push("الفريمات السريعة غير متاحة لهذا الرمز");

  return {
    score,
    label: score >= 82 ? "ممتازة" : score >= 68 ? "قوية" : score >= 52 ? "متوسطة" : "ضعيفة",
    coverage: frames.length,
    total: TIMEFRAME_CONFIGS.length,
    latestTimestamp: primaryFrame?.latestTimestamp || null,
    priceDispersionPct: round(priceDispersionPct, 2),
    freshnessScore: Math.round(freshnessScore),
    depthScore: Math.round(depthScore),
    consistencyScore: Math.round(consistencyScore),
    staleFrames,
    lowDepthFrames,
    hasFastFrames: ["1m", "15m", "30m"].some((id) => availableIds.has(id)),
    hasDailyFrame: availableIds.has("1d"),
    notes: notes.slice(0, 5)
  };
}

function getFrameFreshness(frame) {
  const latestTimestamp = Number(frame.latestTimestamp || frame.timestamps?.at(-1) || 0);
  if (!Number.isFinite(latestTimestamp) || latestTimestamp <= 0) {
    return { frame, score: 55, ageHours: null, isStale: false };
  }

  const ageSeconds = Math.max(0, Date.now() / 1000 - latestTimestamp);
  const maxAgeSeconds = getFrameMaxAgeSeconds(frame.id);
  const softLimit = maxAgeSeconds * 0.48;
  const score = clamp(100 - (Math.max(0, ageSeconds - softLimit) / maxAgeSeconds) * 82, 10, 100);

  return {
    frame,
    score,
    ageHours: round(ageSeconds / 3600, 1),
    isStale: ageSeconds > maxAgeSeconds
  };
}

function getFrameMaxAgeSeconds(id) {
  const day = 24 * 60 * 60;
  return {
    "1m": 3 * day,
    "15m": 6 * day,
    "30m": 7 * day,
    "1h": 10 * day,
    "1d": 14 * day,
    "1wk": 45 * day,
    "1mo": 110 * day,
    "1y": 110 * day
  }[id] || 14 * day;
}

function calibrateRecommendation(rawRecommendation, frames, dataHealth) {
  let recommendation = cloneRecommendation(rawRecommendation);
  const dailyFrame = frames.find((frame) => frame.id === "1d");
  const dailyOpposite =
    dailyFrame &&
    recommendation.action !== "hold" &&
    dailyFrame.signal.action !== "hold" &&
    dailyFrame.signal.action !== recommendation.action;

  if (Number(dataHealth?.priceDispersionPct || 0) > 4) {
    return forceHoldRecommendation(
      recommendation,
      56,
      "تفاوت السعر بين الفريمات مرتفع؛ تم تحويل القرار إلى انتظار حتى تتطابق البيانات."
    );
  }

  if (dataHealth.score < 45) {
    return forceHoldRecommendation(
      recommendation,
      55,
      "جودة البيانات منخفضة؛ لا توجد ثقة كافية لإصدار شراء أو بيع الآن."
    );
  }

  if (dailyOpposite) {
    return forceHoldRecommendation(
      recommendation,
      60,
      "الفريم اليومي يعاكس قرار الفريمات الأخرى؛ الأفضل انتظار تأكيد أوضح."
    );
  }

  if (recommendation.action !== "hold") {
    if (!dataHealth.hasDailyFrame) {
      recommendation = capRecommendationConfidence(recommendation, 68, "الفريم اليومي غير متاح، لذلك تم خفض الثقة.");
    }

    if (!dataHealth.hasFastFrames) {
      recommendation = capRecommendationConfidence(recommendation, 70, "الفريمات السريعة غير متاحة، لذلك الدخول اللحظي يحتاج حذر.");
    }

    if (dataHealth.coverage < 5) {
      recommendation = capRecommendationConfidence(recommendation, 72, "عدد الفريمات المتاحة أقل من المطلوب، لذلك الثقة محدودة.");
    }

    if (dataHealth.score < 62) {
      recommendation = capRecommendationConfidence(recommendation, 66, "صحة البيانات متوسطة أو ضعيفة، لذلك تم تخفيض الثقة.");
    }
  }

  return recommendation;
}

function applyExecutionGate(recommendation, tradePlan, dataHealth) {
  if (recommendation.action === "hold") return recommendation;

  const riskReward = Number(tradePlan?.riskReward);
  if (!Number.isFinite(riskReward)) {
    return forceHoldRecommendation(
      recommendation,
      58,
      "خطة الصفقة غير مكتملة لأن العائد مقابل المخاطرة غير واضح."
    );
  }

  if (riskReward < 0.9) {
    return forceHoldRecommendation(
      recommendation,
      58,
      "العائد مقابل المخاطرة ضعيف؛ تم إلغاء إشارة الدخول."
    );
  }

  let calibrated = recommendation;
  if (riskReward < 1.15) {
    calibrated = capRecommendationConfidence(calibrated, 68, "العائد مقابل المخاطرة مقبول بصعوبة، لذلك الثقة محدودة.");
  }

  if (dataHealth.score < 58) {
    calibrated = capRecommendationConfidence(calibrated, 64, "صحة البيانات ليست قوية بما يكفي لرفع الثقة.");
  }

  return calibrated;
}

function applyPrecisionGate(recommendation, backtest) {
  const next = cloneRecommendation(recommendation);
  const winRate = Number(backtest?.winRate);
  const samples = Number(backtest?.samples || 0);
  next.precision = {
    enabled: true,
    required: PRECISION_MIN_WINRATE,
    measuredWinRate: Number.isFinite(winRate) ? winRate : null,
    samples,
    passed: false
  };

  if (next.action === "hold") return next;

  if (!Number.isFinite(winRate) || samples < PRECISION_MIN_SAMPLES) {
    return forceHoldRecommendation(
      next,
      58,
      `وضع الدقة العالية: عينات الاختبار الخلفي (${samples}) غير كافية لإثبات نسبة نجاح ${PRECISION_MIN_WINRATE}%، لذلك لا تُنشر الإشارة.`
    );
  }

  if (winRate < PRECISION_MIN_WINRATE) {
    return forceHoldRecommendation(
      next,
      62,
      `وضع الدقة العالية: نسبة إصابة هذا الإعداد تاريخياً ${winRate}% وهي أقل من الحد المطلوب ${PRECISION_MIN_WINRATE}%.`
    );
  }

  // ثقة مبنية على النتائج الفعلية (تنعيم لابلاس لتجنب المبالغة مع العينات القليلة)
  const wins = Number(backtest.wins ?? Math.round((winRate / 100) * samples));
  const smoothedWinRate = ((wins + 2) / (samples + 4)) * 100;
  next.precision.passed = true;
  next.confidence = clamp(Math.round(Math.min(96, smoothedWinRate * 0.7 + next.confidence * 0.3)), 62, 96);
  next.reasons = uniqueReasons([
    `اجتاز فلتر الدقة العالية: إصابة الهدف الأول ${winRate}% عبر ${samples} صفقة تاريخية على نفس الرمز`,
    ...next.reasons
  ]).slice(0, 6);

  return next;
}

function cloneRecommendation(recommendation) {
  return {
    ...recommendation,
    reasons: [...(recommendation.reasons || [])]
  };
}

function capRecommendationConfidence(recommendation, cap, reason) {
  const next = cloneRecommendation(recommendation);
  next.confidence = Math.min(next.confidence, cap);
  next.reasons = uniqueReasons([reason, ...next.reasons]).slice(0, 6);
  return next;
}

function forceHoldRecommendation(recommendation, cap, reason) {
  const next = cloneRecommendation(recommendation);
  return {
    ...next,
    action: "hold",
    actionLabel: "انتظار",
    confidence: Math.min(next.confidence, cap),
    duration: "انتظار حتى تتحسن جودة البيانات ويتوافق اليومي مع الفريمات السريعة",
    reasons: uniqueReasons([reason, ...next.reasons]).slice(0, 6)
  };
}

function pickPrimaryFrame(frames) {
  return (
    frames.find((frame) => frame.id === "1d") ||
    frames.find((frame) => frame.id === "1h") ||
    frames.find((frame) => frame.id === "30m") ||
    frames.at(-1) ||
    null
  );
}

function scoreMultiTimeframe(frames) {
  const totalWeight = frames.reduce((sum, frame) => sum + frame.weight, 0) || 1;
  const weightedScore = frames.reduce((sum, frame) => sum + frame.signal.score * frame.weight, 0) / totalWeight;
  const bullishWeight = frames.filter((frame) => frame.signal.action === "buy").reduce((sum, frame) => sum + frame.weight, 0);
  const bearishWeight = frames.filter((frame) => frame.signal.action === "sell").reduce((sum, frame) => sum + frame.weight, 0);
  const holdWeight = Math.max(0, totalWeight - bullishWeight - bearishWeight);
  const dominantWeight = Math.max(bullishWeight, bearishWeight, holdWeight);
  const agreementPct = Math.round((dominantWeight / totalWeight) * 100);
  const coveragePenalty = Math.max(0, TIMEFRAME_CONFIGS.length - frames.length) * 2.5;
  const absScore = Math.abs(weightedScore);
  const fastFrames = frames.filter((frame) => ["1m", "15m", "30m", "1h"].includes(frame.id));
  const slowFrames = frames.filter((frame) => ["1d", "1wk", "1mo", "1y"].includes(frame.id));
  const fastBias = getFrameBias(fastFrames);
  const slowBias = getFrameBias(slowFrames);
  const hasConflict = fastBias !== "neutral" && slowBias !== "neutral" && fastBias !== slowBias;
  const conflictPenalty = hasConflict ? 8 : 0;
  const confidence = clamp(Math.round(48 + absScore * 5 + Math.max(0, agreementPct - 50) * 0.55 - coveragePenalty - conflictPenalty), 45, 92);

  let action = "hold";
  if (weightedScore >= 2.2 && bullishWeight >= totalWeight * 0.42) action = "buy";
  if (weightedScore <= -2.2 && bearishWeight >= totalWeight * 0.42) action = "sell";
  if (hasConflict && agreementPct < 68) action = "hold";

  const actionLabel = action === "buy" ? "شراء" : action === "sell" ? "بيع" : "انتظار";
  const bias = weightedScore > 0.8 ? "صاعد" : weightedScore < -0.8 ? "هابط" : "محايد";
  const conflict = hasConflict
    ? `تضارب بين الفريمات السريعة (${fastBias === "bullish" ? "صاعدة" : "هابطة"}) والطويلة (${slowBias === "bullish" ? "صاعدة" : "هابطة"})`
    : "";

  return {
    action,
    actionLabel,
    confidence: action === "hold" ? Math.min(confidence, 62) : confidence,
    score: weightedScore,
    duration: chooseConsensusDuration(frames, action),
    agreementPct,
    bias,
    conflict,
    reasons: buildConsensusReasons(frames, actionLabel, agreementPct, bias, conflict)
  };
}

function getFrameBias(frames) {
  if (!frames.length) return "neutral";
  const score = frames.reduce((sum, frame) => sum + frame.signal.score * frame.weight, 0) / frames.reduce((sum, frame) => sum + frame.weight, 0);
  if (score > 1.1) return "bullish";
  if (score < -1.1) return "bearish";
  return "neutral";
}

function buildConsensusReasons(frames, actionLabel, agreementPct, bias, conflict = "") {
  const byId = new Map(frames.map((frame) => [frame.id, frame]));
  const core = ["1h", "1d", "1wk", "1mo"]
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((frame) => `${frame.label}: ${frame.signal.actionLabel}`);
  const fast = ["1m", "15m", "30m"]
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((frame) => `${frame.label}: ${frame.signal.actionLabel}`);

  return [
    `القرار النهائي ${actionLabel} بعد دمج ${frames.length} فريمات من أصل ${TIMEFRAME_CONFIGS.length}`,
    `نسبة توافق الفريمات ${agreementPct}% والاتجاه العام ${bias}`,
    conflict || "لا يوجد تضارب قوي بين الفريمات الأساسية والسريعة",
    core.length ? `الفريمات الأساسية: ${core.join("، ")}` : "الفريمات الأساسية غير مكتملة لهذا الرمز",
    fast.length ? `فريمات الدخول السريع: ${fast.join("، ")}` : "الفريمات اللحظية غير متاحة لهذا السوق"
  ].slice(0, 5);
}

function chooseConsensusDuration(frames, action) {
  if (action === "hold") return "انتظار حتى يتوافق 15 دقيقة + الساعة + اليوم";

  const longTermSupport = frames
    .filter((frame) => ["1d", "1wk", "1mo", "1y"].includes(frame.id))
    .filter((frame) => frame.signal.action === action).length;
  const fastSupport = frames
    .filter((frame) => ["1m", "15m", "30m", "1h"].includes(frame.id))
    .filter((frame) => frame.signal.action === action).length;

  if (longTermSupport >= 3 && fastSupport >= 2) return "15 دقيقة إلى 4 أسابيع";
  if (longTermSupport >= 2) return "1 يوم إلى 6 أسابيع";
  if (fastSupport >= 3) return "1 دقيقة إلى 1 يوم";
  return "30 دقيقة إلى 10 أيام";
}

function buildIndicators(closes, highs, lows, volumes, currentPrice) {
  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  const ema9 = emaSeries(closes, 9).at(-1) ?? currentPrice;
  const ema21 = emaSeries(closes, 21).at(-1) ?? currentPrice;
  const ema50 = emaSeries(closes, 50).at(-1) ?? sma50 ?? currentPrice;
  const ema200 = closes.length >= 60 ? (emaSeries(closes, 200).at(-1) ?? sma50) : sma50;
  const ema12 = emaSeries(closes, 12);
  const ema26 = emaSeries(closes, 26);
  const macdSeries = ema12.map((value, index) => value - ema26[index]).filter(Number.isFinite);
  const macd = macdSeries.at(-1) ?? 0;
  const macdSignal = emaSeries(macdSeries, 9).at(-1) ?? 0;
  const macdHistPrev = macdSeries.length > 1
    ? (macdSeries.at(-2) ?? 0) - (emaSeries(macdSeries.slice(0, -1), 9).at(-1) ?? 0)
    : 0;
  const rsi14 = rsi(closes, 14);
  const previousMomentumPrice = closes.at(-21);
  const momentum20 = closes.length > 20 && previousMomentumPrice > 0 ? (currentPrice - previousMomentumPrice) / previousMomentumPrice : 0;
  const returns = closes
    .slice(-21)
    .map((close, index, arr) => {
      if (index === 0 || close <= 0 || arr[index - 1] <= 0) return null;
      return Math.log(close / arr[index - 1]);
    })
    .filter(Number.isFinite);
  const volatility20 = finiteOr(stdDev(returns) * Math.sqrt(20), 0);
  const atr14 = atr(highs, lows, closes, 14);
  const trend = adx(highs, lows, closes, 14);
  const stoch = stochastic(highs, lows, closes, 14, 3);
  const bands = bollinger(closes, 20, 2);
  const obvTrend = obvSlope(closes, volumes, 20);
  const averageVolume20 = sma(volumes, 20) || 0;
  const averageVolume50 = sma(volumes, 50) || averageVolume20 || 1;
  const latestVolume = finiteOr(volumes.at(-1), 0);
  const volumeTrend = averageVolume50 ? (averageVolume20 - averageVolume50) / averageVolume50 : 0;
  const relativeVolume = averageVolume20 ? latestVolume / averageVolume20 : 0;
  const vwap = calculateVwap(highs, lows, closes, volumes, 50) || sma20 || currentPrice;
  const supportResistance = calculateSupportResistance(highs, lows, closes, currentPrice);

  return {
    currentPrice,
    sma20,
    sma50,
    ema9,
    ema21,
    ema50,
    ema200,
    macd,
    macdSignal,
    macdHistPrev,
    rsi14,
    momentum20,
    volatility20,
    atr14,
    adx14: trend.adx,
    plusDI: trend.plusDI,
    minusDI: trend.minusDI,
    stochK: stoch.k,
    stochD: stoch.d,
    bbUpper: bands.upper,
    bbLower: bands.lower,
    bbPos: bands.pos,
    bbWidth: bands.width,
    obvSlope: obvTrend,
    vwap,
    support: supportResistance.support,
    resistance: supportResistance.resistance,
    latestVolume,
    averageVolume20,
    averageVolume50,
    relativeVolume,
    volumeTrend
  };
}

function calculateVwap(highs, lows, closes, volumes, period = 50) {
  const start = Math.max(0, closes.length - period);
  let priceVolume = 0;
  let totalVolume = 0;

  for (let index = start; index < closes.length; index += 1) {
    const typical = (finiteOr(highs[index], closes[index]) + finiteOr(lows[index], closes[index]) + closes[index]) / 3;
    const volume = Math.max(0, finiteOr(volumes[index], 0));
    priceVolume += typical * volume;
    totalVolume += volume;
  }

  if (totalVolume <= 0) return sma(closes, Math.min(period, closes.length));
  return priceVolume / totalVolume;
}

function calculateSupportResistance(highs, lows, closes, currentPrice) {
  const recentHighs = compactNumbers(highs.slice(-80));
  const recentLows = compactNumbers(lows.slice(-80));
  const lastCloses = compactNumbers(closes.slice(-80));
  const fallbackAtr = Math.max(currentPrice * 0.015, atr(highs, lows, closes, 14));
  const supportCandidates = [...recentLows, ...lastCloses].filter((value) => value < currentPrice);
  const resistanceCandidates = [...recentHighs, ...lastCloses].filter((value) => value > currentPrice);
  const support = supportCandidates.length ? Math.max(...supportCandidates) : currentPrice - fallbackAtr;
  const resistance = resistanceCandidates.length ? Math.min(...resistanceCandidates) : currentPrice + fallbackAtr;

  return {
    support: round(Math.max(0, support), getPrecision(currentPrice)),
    resistance: round(Math.max(currentPrice, resistance), getPrecision(currentPrice))
  };
}

function getDefaultShariaSource(status) {
  if (!status || status === "unknown") return "";
  return "تصنيف محلي مبني على مراجع فحص شرعي عامة، ويحتاج تحديث دوري";
}

function buildRiskProfile(indicators, score, agreementPct = 0) {
  let points = 0;
  const notes = [];

  if (indicators.volatility20 > 0.16) {
    points += 3;
    notes.push("تذبذب مرتفع");
  } else if (indicators.volatility20 > 0.09) {
    points += 2;
    notes.push("تذبذب متوسط");
  } else {
    points += 1;
    notes.push("تذبذب منخفض");
  }

  if (indicators.rsi14 > 72 || indicators.rsi14 < 28) {
    points += 2;
    notes.push("RSI عند طرف قوي");
  }

  if (Math.abs(score) < 2.2) {
    points += 1;
    notes.push("الإشارة ليست حادة");
  }

  if (agreementPct && agreementPct < 60) {
    points += 1;
    notes.push("توافق الفريمات متوسط");
  }

  if (indicators.volumeTrend < -0.2) {
    points += 1;
    notes.push("النشاط أقل من المعتاد");
  }

  if (points >= 5) {
    return { level: "high", label: "مخاطرة عالية", score: points, notes: notes.slice(0, 3) };
  }

  if (points >= 3) {
    return { level: "medium", label: "مخاطرة متوسطة", score: points, notes: notes.slice(0, 3) };
  }

  return { level: "low", label: "مخاطرة منخفضة", score: points, notes: notes.slice(0, 3) };
}

function backtestSignals(closes, highs, lows, volumes) {
  const horizonDays = BACKTEST_HORIZON;
  const samples = [];
  const limit = closes.length - horizonDays;
  const start = Math.max(65, Math.min(210, Math.floor(closes.length * 0.35)));

  for (let index = start; index < limit; index += 3) {
    const entry = closes[index];
    if (!Number.isFinite(entry) || entry <= 0) continue;

    const localIndicators = buildIndicators(
      closes.slice(0, index + 1),
      highs.slice(0, index + 1),
      lows.slice(0, index + 1),
      volumes.slice(0, index + 1),
      entry
    );
    const signal = scoreSignal(localIndicators);
    if (signal.action === "hold") continue;

    const atrValue = Math.max(finiteOr(localIndicators.atr14, 0), entry * 0.004);
    const direction = signal.action === "buy" ? 1 : -1;
    const takeProfit = entry + direction * atrValue * TP1_ATR_MULTIPLE;
    const stopLoss = entry - direction * atrValue * SL_ATR_MULTIPLE;
    let outcome = null;

    // محاكاة أول ملامسة: أيهما يُلمس أولا، الهدف الأول أم الوقف؟
    for (let step = index + 1; step <= index + horizonDays; step += 1) {
      const high = highs[step];
      const low = lows[step];
      if (!Number.isFinite(high) || !Number.isFinite(low)) continue;

      const hitStop = direction === 1 ? low <= stopLoss : high >= stopLoss;
      const hitTarget = direction === 1 ? high >= takeProfit : low <= takeProfit;

      if (hitStop) { outcome = false; break; } // تحفظي: عند تلامس الاثنين بنفس الشمعة تُحسب خسارة
      if (hitTarget) { outcome = true; break; }
    }

    if (outcome === null) {
      const exit = closes[index + horizonDays];
      outcome = direction === 1 ? exit > entry : exit < entry;
    }

    const exitPrice = outcome ? takeProfit : stopLoss;
    samples.push({
      action: signal.action,
      success: outcome,
      returnPct: pctChange(entry, exitPrice) * direction
    });
  }

  if (samples.length < 3) {
    return {
      samples: samples.length,
      wins: 0,
      winRate: null,
      avgReturnPct: null,
      horizonDays,
      tpAtrMultiple: TP1_ATR_MULTIPLE,
      slAtrMultiple: SL_ATR_MULTIPLE,
      label: "بيانات غير كافية"
    };
  }

  const wins = samples.filter((sample) => sample.success).length;
  const avgReturnPct = samples.reduce((sum, sample) => sum + sample.returnPct, 0) / samples.length;
  const winRate = round((wins / samples.length) * 100, 1);

  return {
    samples: samples.length,
    wins,
    winRate,
    avgReturnPct: round(avgReturnPct, 2),
    horizonDays,
    tpAtrMultiple: TP1_ATR_MULTIPLE,
    slAtrMultiple: SL_ATR_MULTIPLE,
    label: `${winRate}% إصابة الهدف الأول`
  };
}

function scoreSignal(indicators) {
  let score = 0;
  const reasons = [];
  const {
    currentPrice,
    sma20,
    sma50,
    ema9,
    ema21,
    ema200,
    macd,
    macdSignal,
    macdHistPrev,
    rsi14,
    momentum20,
    volumeTrend,
    volatility20,
    vwap,
    relativeVolume,
    adx14,
    plusDI,
    minusDI,
    stochK,
    stochD,
    bbPos,
    obvSlope: obvTrend
  } = indicators;

  // 1) نظام السوق العام (فلتر الاتجاه الكبير EMA200)
  if (currentPrice > ema200) {
    score += 1.2;
    reasons.push("السعر فوق EMA200: النظام العام صاعد");
  } else {
    score -= 1.2;
    reasons.push("السعر تحت EMA200: النظام العام هابط");
  }

  if (indicators.ema50 > ema200) score += 0.6; else score -= 0.6;

  // 2) هيكل الاتجاه القريب
  if (currentPrice > ema21) score += 0.6; else score -= 0.6;
  if (ema9 > ema21) {
    score += 0.5;
    reasons.push("تقاطع EMA9/21 إيجابي");
  } else {
    score -= 0.5;
  }
  if (sma20 > sma50) score += 0.5; else score -= 0.5;

  // 3) الزخم
  const macdHist = macd - macdSignal;
  if (macdHist > 0) {
    score += macdHist > macdHistPrev ? 0.9 : 0.6;
    reasons.push(macdHist > macdHistPrev ? "MACD إيجابي ومتسارع" : "MACD إيجابي");
  } else {
    score -= macdHist < macdHistPrev ? 0.9 : 0.6;
    reasons.push(macdHist < macdHistPrev ? "MACD سلبي ومتسارع" : "MACD سلبي");
  }

  if (momentum20 > 0.03) {
    score += 0.7;
    reasons.push("زخم شهري إيجابي");
  } else if (momentum20 < -0.03) {
    score -= 0.7;
    reasons.push("زخم شهري سلبي");
  }

  if (currentPrice > vwap) score += 0.4; else score -= 0.4;

  // 4) RSI بمناطق دقيقة (Wilder)
  if (rsi14 >= 53 && rsi14 <= 68) {
    score += 0.5;
    reasons.push(`RSI ${round(rsi14, 1)}: زخم صحي`);
  } else if (rsi14 > 75) {
    score -= 1.0;
    reasons.push("RSI في تشبع شرائي حاد");
  } else if (rsi14 < 25) {
    score += currentPrice > ema200 ? 0.8 : -0.4;
    reasons.push(currentPrice > ema200 ? "RSI تشبع بيعي داخل اتجاه صاعد: فرصة ارتداد" : "تشبع بيعي داخل اتجاه هابط: خطر استمرار الهبوط");
  } else if (rsi14 >= 32 && rsi14 <= 45) {
    score -= 0.4;
  }

  // 5) ستوكاستيك: تقاطعات من مناطق التشبع
  if (stochK > stochD && stochK < 35) {
    score += 0.6;
    reasons.push("تقاطع ستوكاستيك صاعد من تشبع بيعي");
  } else if (stochK < stochD && stochK > 65) {
    score -= 0.6;
    reasons.push("تقاطع ستوكاستيك هابط من تشبع شرائي");
  }

  // 6) بولنجر: تمدد سعري خارج النطاق = خطر انعكاس
  if (bbPos > 1.02) {
    score -= 0.6;
    reasons.push("السعر خارج نطاق بولنجر العلوي");
  } else if (bbPos < -0.02) {
    score += 0.6;
    reasons.push("السعر خارج نطاق بولنجر السفلي");
  }

  // 7) تأكيد السيولة (OBV + الحجم النسبي)
  if (obvTrend > 0.04) {
    score += 0.5;
    reasons.push("تدفق سيولة شرائي (OBV صاعد)");
  } else if (obvTrend < -0.04) {
    score -= 0.5;
    reasons.push("تدفق سيولة بيعي (OBV هابط)");
  }

  if (relativeVolume > 1.3) {
    score += score >= 0 ? 0.4 : -0.4;
    reasons.push("حجم تداول أعلى من المتوسط يؤكد الحركة");
  } else if (relativeVolume < 0.5) {
    score *= 0.85;
    reasons.push("حجم التداول ضعيف");
  }

  if (volumeTrend > 0.15) score += score >= 0 ? 0.25 : -0.25;

  // 8) قوة الاتجاه ADX: تضخيم الإشارة مع الاتجاه القوي وكبحها في السوق العرضي
  if (adx14 >= 25 && ((score > 0 && plusDI > minusDI) || (score < 0 && minusDI > plusDI))) {
    score *= 1.12;
    reasons.push(`ADX ${round(adx14, 0)}: اتجاه قوي يدعم الإشارة`);
  } else if (adx14 > 0 && adx14 < 17) {
    score *= 0.7;
    reasons.push("ADX منخفض: سوق عرضي بلا اتجاه واضح");
  }

  if (volatility20 > 0.16) {
    score *= 0.9;
    reasons.push("التذبذب مرتفع نسبيا");
  }

  const absScore = Math.abs(score);
  const confidence = clamp(Math.round(50 + absScore * 4.6), 50, 90);

  // عتبات صارمة: لا إشارة بدون توافق قوي بين المؤشرات
  if (score >= 3.4) {
    return {
      action: "buy",
      actionLabel: "شراء",
      confidence,
      score,
      duration: chooseDuration(volatility20, "up"),
      reasons: reasons.slice(0, 5)
    };
  }

  if (score <= -3.4) {
    return {
      action: "sell",
      actionLabel: "بيع",
      confidence,
      score,
      duration: chooseDuration(volatility20, "down"),
      reasons: reasons.slice(0, 5)
    };
  }

  return {
    action: "hold",
    actionLabel: "انتظار",
    confidence: clamp(Math.round(48 + absScore * 4), 48, 60),
    score,
    duration: "3 إلى 10 أيام",
    reasons: ["توافق المؤشرات أقل من عتبة الدقة العالية", ...reasons.slice(0, 4)]
  };
}

function buildTradePlan(currentPrice, expectedPrice, indicators, recommendation, frames) {
  const precision = getPrecision(currentPrice);
  const action = recommendation.action;
  const atrValue = Math.max(
    finiteOr(indicators.atr14, 0),
    Math.abs(currentPrice) * clamp(finiteOr(indicators.volatility20, 0) * 0.22, 0.006, 0.035),
    Math.abs(currentPrice) * 0.006
  );
  const support = indicators.support || round(Math.max(0, currentPrice - atrValue * 1.4), precision);
  const resistance = indicators.resistance || round(currentPrice + atrValue * 1.4, precision);
  const targetDirection = action === "sell" ? -1 : 1;
  const entryPrice = round(currentPrice, precision);

  if (action === "hold") {
    return {
      action,
      entryPrice,
      target1: round(expectedPrice, precision),
      target2: round(currentPrice + targetDirection * atrValue * 1.2, precision),
      stopLoss: null,
      support,
      resistance,
      riskReward: null,
      atr: round(atrValue, precision),
      note: "لا توجد صفقة واضحة؛ انتظر توافق الفريمات."
    };
  }

  const agreementBoost = clamp((recommendation.agreementPct - 50) / 100, 0, 0.25);
  // نفس هندسة الاختبار الخلفي: هدف أول قريب باحتمال إصابة مرتفع + وقف واسع خلف الهيكل
  const target1Distance = atrValue * (TP1_ATR_MULTIPLE + agreementBoost * 0.3);
  const target2Distance = Math.max(atrValue * TP2_ATR_MULTIPLE, target1Distance * 2.1);
  const stopDistance = Math.max(atrValue * SL_ATR_MULTIPLE, currentPrice * 0.008);
  const stopCandidate = action === "buy"
    ? Math.min(currentPrice - stopDistance, support - atrValue * 0.18)
    : Math.max(currentPrice + stopDistance, resistance + atrValue * 0.18);
  const target1 = Math.max(0, currentPrice + targetDirection * target1Distance);
  const target2 = Math.max(0, currentPrice + targetDirection * target2Distance);
  const risk = Math.abs(currentPrice - stopCandidate);
  const reward1 = Math.abs(target1 - currentPrice);
  const reward2 = Math.abs(target2 - currentPrice);
  const riskReward = risk > 0 ? reward2 / risk : null;
  const riskReward1 = risk > 0 ? reward1 / risk : null;

  return {
    action,
    entryPrice,
    target1: round(target1, precision),
    target2: round(target2, precision),
    stopLoss: round(Math.max(0, stopCandidate), precision),
    support,
    resistance,
    riskReward: Number.isFinite(riskReward) ? round(riskReward, 2) : null,
    riskReward1: Number.isFinite(riskReward1) ? round(riskReward1, 2) : null,
    atr: round(atrValue, precision),
    note: buildTradePlanNote(action, riskReward, frames)
  };
}

function buildTradePlanNote(action, riskReward, frames) {
  const fastReady = frames.filter((frame) => ["15m", "30m", "1h"].includes(frame.id) && frame.signal.action === action).length;
  const rrText = Number.isFinite(riskReward)
    ? `العائد إلى المخاطرة حتى الهدف الثاني ${round(riskReward, 2)}. الهدف الأول قريب عمداً لرفع احتمال الإصابة`
    : "العائد إلى المخاطرة غير مكتمل";
  if (fastReady >= 2) return `${rrText}. فريمات الدخول تدعم القرار.`;
  return `${rrText}. انتظر تأكيد فريم 15 أو 30 دقيقة قبل الدخول.`;
}

function buildAnalysisQuality(frames, recommendation, indicators, backtest, dataHealth = {}) {
  const coverage = frames.length / TIMEFRAME_CONFIGS.length;
  const agreement = clamp(recommendation.agreementPct || 0, 0, 100) / 100;
  const volumeScore = clamp(finiteOr(indicators.relativeVolume, 0.75), 0, 1.5) / 1.5;
  const backtestScore = Number.isFinite(backtest?.winRate) ? clamp(backtest.winRate, 0, 100) / 100 : 0.45;
  const dataScore = clamp(Number(dataHealth.score ?? 55), 0, 100) / 100;
  const conflictPenalty = recommendation.conflict ? 0.14 : 0;
  const score = Math.round(clamp((coverage * 0.22 + agreement * 0.27 + volumeScore * 0.12 + backtestScore * 0.18 + dataScore * 0.21 - conflictPenalty) * 100, 0, 100));
  const label = score >= 80 ? "ممتازة" : score >= 68 ? "قوية" : score >= 55 ? "متوسطة" : "ضعيفة";

  return {
    score,
    label,
    coverage: frames.length,
    total: TIMEFRAME_CONFIGS.length,
    notes: [
      `تغطية الفريمات ${frames.length}/${TIMEFRAME_CONFIGS.length}`,
      `توافق ${recommendation.agreementPct}%`,
      `صحة البيانات ${dataHealth.score ?? "--"}% ${dataHealth.label || ""}`.trim(),
      recommendation.conflict || "بدون تضارب قوي",
      ...(dataHealth.notes || []).slice(0, 1),
      Number.isFinite(backtest?.winRate) ? `Backtest ${backtest.winRate}%` : "Backtest غير كاف"
    ].slice(0, 6)
  };
}

function buildDecisionSummary(recommendation, risk, tradePlan, quality, dataHealth = {}) {
  if (Number(dataHealth.score || 0) > 0 && dataHealth.score < 50) {
    return {
      kind: "avoid",
      badge: "انتظر",
      title: "البيانات غير كافية",
      message: "صحة البيانات منخفضة أو غير مكتملة، لذلك الأفضل عدم التداول حتى تتحدث الفريمات وتتقارب الأسعار."
    };
  }

  if (Number(dataHealth.priceDispersionPct || 0) > 3.5) {
    return {
      kind: "avoid",
      badge: "انتظر",
      title: "تضارب بيانات السعر",
      message: "يوجد تفاوت واضح بين أسعار الفريمات. انتظر تحديث البيانات قبل أي قرار."
    };
  }

  if (recommendation.action === "buy" && recommendation.confidence >= 70 && quality.score >= 62 && risk?.level !== "high") {
    return {
      kind: "buy",
      badge: "اشتر",
      title: "فرصة شراء مشروطة",
      message: `راقب دخول قريب من ${tradePlan.entryPrice}. الهدف الأول ${tradePlan.target1} ووقف الخسارة ${tradePlan.stopLoss}.`
    };
  }

  if (recommendation.action === "sell" && recommendation.confidence >= 68 && quality.score >= 58) {
    return {
      kind: "sell",
      badge: "بيع",
      title: "ضغط بيعي واضح",
      message: `الإشارة تميل للبيع. الهدف الأول ${tradePlan.target1} ووقف الخطر ${tradePlan.stopLoss}.`
    };
  }

  if (recommendation.conflict || risk?.level === "high") {
    return {
      kind: "avoid",
      badge: "لا تتداول",
      title: "تجنب الصفقة الآن",
      message: recommendation.conflict || "المخاطرة عالية مقارنة بجودة الإشارة."
    };
  }

  return {
    kind: "hold",
    badge: "انتظر",
    title: "انتظار تأكيد",
    message: "الإشارة غير كافية للدخول. الأفضل انتظار توافق الفريمات السريعة مع اليومي."
  };
}

function projectPrice(currentPrice, indicators, score, action, frames = []) {
  const direction = action === "sell" ? -1 : action === "buy" ? 1 : score >= 0 ? 1 : -1;
  const totalWeight = frames.reduce((sum, frame) => sum + frame.weight, 0) || 1;
  const weightedMomentum = finiteOr(
    frames.reduce((sum, frame) => sum + finiteOr(frame.indicators.momentum20, 0) * frame.weight, 0) / totalWeight,
    0
  );
  const agreementBoost = frames.length ? frames.filter((frame) => frame.signal.action === action).length / frames.length : 0.5;
  const finiteScore = finiteOr(score, 0);
  const trendMove = clamp(Math.abs(finiteScore) * 0.012 + Math.abs(weightedMomentum) * 0.18 + agreementBoost * 0.004, 0.004, 0.07);
  const volatilityMove = clamp(indicators.volatility20 * 0.35, 0.006, 0.04);
  const atrMove = indicators.atr14 ? clamp(indicators.atr14 / currentPrice, 0.004, 0.035) : 0.008;
  const move = Math.max(trendMove, volatilityMove, atrMove);
  const projected = currentPrice * (1 + direction * move);

  if (!Number.isFinite(projected) || projected <= 0) {
    return round(currentPrice * (1 + direction * 0.005), getPrecision(currentPrice));
  }

  return round(projected, getPrecision(currentPrice));
}

function chooseDuration(volatility, direction) {
  if (volatility > 0.16) {
    return direction === "up" ? "3 إلى 12 يوم" : "2 إلى 10 أيام";
  }
  if (volatility > 0.08) {
    return "7 إلى 21 يوم";
  }
  return "14 إلى 35 يوم";
}

function compactNumbers(values = []) {
  return values.filter((value) => Number.isFinite(value));
}

function average(values = [], fallback = 0) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return fallback;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

function uniqueReasons(reasons = []) {
  return [...new Set(reasons.filter(Boolean))];
}

function buildSparkline(values, size) {
  return values.slice(-size).map((value) => round(value, getPrecision(value)));
}

function buildUpsideOutlook(currentPrice, indicators, score) {
  const trendBias =
    (indicators.sma20 > indicators.sma50 ? 0.012 : -0.006) +
    (currentPrice > indicators.sma20 ? 0.006 : -0.004) +
    clamp(indicators.momentum20 * 0.28, -0.025, 0.04) +
    clamp(score * 0.005, -0.018, 0.026);
  const volatilityLift = clamp(indicators.volatility20 * 0.08, 0, 0.015);
  const rsiAdjustment = indicators.rsi14 > 72 ? -0.014 : indicators.rsi14 < 35 ? 0.008 : 0;
  const monthlyMove = clamp(trendBias + volatilityLift + rsiAdjustment, -0.05, 0.075);

  return [
    { months: 1, label: "شهر" },
    { months: 2, label: "شهرين" },
    { months: 3, label: "3 شهور" }
  ].map((horizon) => {
    const compoundedMove = Math.pow(1 + monthlyMove, horizon.months) - 1;
    const uncertainty = indicators.volatility20 * 0.025 * Math.max(0, horizon.months - 1);
    const move = clamp(compoundedMove - uncertainty, -0.12, 0.22);
    const targetPrice = round(currentPrice * (1 + move), getPrecision(currentPrice));
    const confidenceBase =
      48 +
      Math.max(score, 0) * 7 +
      Math.max(indicators.momentum20, 0) * 80 +
      (indicators.sma20 > indicators.sma50 ? 6 : 0) -
      (horizon.months - 1) * 4 -
      (indicators.rsi14 > 72 ? 6 : 0);

    return {
      ...horizon,
      targetPrice,
      movePct: pctChange(currentPrice, targetPrice),
      confidence: clamp(Math.round(confidenceBase), 45, 86)
    };
  });
}

function sma(values, period) {
  if (!values?.length) return 0;
  const slice = values.slice(-period);
  return slice.reduce((sum, value) => sum + value, 0) / slice.length;
}

function emaSeries(values, period) {
  if (!values.length) return [];
  const multiplier = 2 / (period + 1);
  const series = [];
  let previous = values[0];

  for (const value of values) {
    previous = value * multiplier + previous * (1 - multiplier);
    series.push(previous);
  }

  return series;
}

function rsi(values, period) {
  if (values.length <= period) return 50;

  // RSI بطريقة Wilder الأصلية (تنعيم أسي) بدلا من المتوسط البسيط: أدق بكثير
  let gains = 0;
  let losses = 0;
  for (let index = 1; index <= period; index += 1) {
    const change = values[index] - values[index - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let index = period + 1; index < values.length; index += 1) {
    const change = values[index] - values[index - 1];
    avgGain = (avgGain * (period - 1) + Math.max(change, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-change, 0)) / period;
  }

  if (avgLoss === 0) return 100;
  return 100 - 100 / (1 + avgGain / avgLoss);
}

function atr(highs, lows, closes, period) {
  const limit = Math.min(highs.length, lows.length, closes.length);
  if (limit < 2) return 0;

  const trueRanges = [];
  for (let index = 1; index < limit; index += 1) {
    const high = highs[index];
    const low = lows[index];
    const previousClose = closes[index - 1];
    trueRanges.push(Math.max(high - low, Math.abs(high - previousClose), Math.abs(low - previousClose)));
  }

  if (trueRanges.length <= period) return sma(trueRanges, trueRanges.length);

  // ATR بطريقة Wilder (تنعيم متتابع) بدلا من المتوسط البسيط
  let value = sma(trueRanges.slice(0, period), period);
  for (let index = period; index < trueRanges.length; index += 1) {
    value = (value * (period - 1) + trueRanges[index]) / period;
  }

  return value;
}

function adx(highs, lows, closes, period = 14) {
  const limit = Math.min(highs.length, lows.length, closes.length);
  if (limit < period * 2 + 2) return { adx: 0, plusDI: 0, minusDI: 0 };

  const trueRanges = [];
  const plusDMs = [];
  const minusDMs = [];

  for (let index = 1; index < limit; index += 1) {
    const upMove = highs[index] - highs[index - 1];
    const downMove = lows[index - 1] - lows[index];
    plusDMs.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDMs.push(downMove > upMove && downMove > 0 ? downMove : 0);
    trueRanges.push(Math.max(
      highs[index] - lows[index],
      Math.abs(highs[index] - closes[index - 1]),
      Math.abs(lows[index] - closes[index - 1])
    ));
  }

  let trSum = trueRanges.slice(0, period).reduce((sum, value) => sum + value, 0);
  let plusSum = plusDMs.slice(0, period).reduce((sum, value) => sum + value, 0);
  let minusSum = minusDMs.slice(0, period).reduce((sum, value) => sum + value, 0);
  const dxValues = [];
  let plusDI = 0;
  let minusDI = 0;

  for (let index = period; index < trueRanges.length; index += 1) {
    trSum = trSum - trSum / period + trueRanges[index];
    plusSum = plusSum - plusSum / period + plusDMs[index];
    minusSum = minusSum - minusSum / period + minusDMs[index];
    plusDI = trSum ? (plusSum / trSum) * 100 : 0;
    minusDI = trSum ? (minusSum / trSum) * 100 : 0;
    const diSum = plusDI + minusDI;
    dxValues.push(diSum ? (Math.abs(plusDI - minusDI) / diSum) * 100 : 0);
  }

  if (!dxValues.length) return { adx: 0, plusDI, minusDI };

  let adxValue = sma(dxValues.slice(0, period), Math.min(period, dxValues.length));
  for (let index = period; index < dxValues.length; index += 1) {
    adxValue = (adxValue * (period - 1) + dxValues[index]) / period;
  }

  return { adx: finiteOr(adxValue, 0), plusDI: finiteOr(plusDI, 0), minusDI: finiteOr(minusDI, 0) };
}

function stochastic(highs, lows, closes, period = 14, smooth = 3) {
  if (closes.length < period + smooth + 1) return { k: 50, d: 50 };

  const rawK = [];
  for (let index = period - 1; index < closes.length; index += 1) {
    const windowHighs = highs.slice(index - period + 1, index + 1).filter(Number.isFinite);
    const windowLows = lows.slice(index - period + 1, index + 1).filter(Number.isFinite);
    if (!windowHighs.length || !windowLows.length) continue;
    const highest = Math.max(...windowHighs);
    const lowest = Math.min(...windowLows);
    rawK.push(highest === lowest ? 50 : ((closes[index] - lowest) / (highest - lowest)) * 100);
  }

  if (rawK.length < smooth) return { k: 50, d: 50 };

  const smoothedK = [];
  for (let index = smooth - 1; index < rawK.length; index += 1) {
    smoothedK.push(sma(rawK.slice(0, index + 1), smooth));
  }

  return {
    k: finiteOr(smoothedK.at(-1), 50),
    d: finiteOr(sma(smoothedK, 3), 50)
  };
}

function bollinger(closes, period = 20, multiplier = 2) {
  if (closes.length < period) {
    const price = closes.at(-1) || 0;
    return { upper: price, lower: price, mid: price, width: 0, pos: 0.5 };
  }

  const slice = closes.slice(-period);
  const mid = sma(closes, period);
  const deviation = stdDev(slice);
  const upper = mid + multiplier * deviation;
  const lower = mid - multiplier * deviation;
  const price = closes.at(-1);
  const pos = upper === lower ? 0.5 : clamp((price - lower) / (upper - lower), -0.5, 1.5);

  return { upper, lower, mid, width: mid ? (upper - lower) / mid : 0, pos };
}

function obvSlope(closes, volumes, period = 20) {
  if (closes.length < period + 2) return 0;

  let obv = 0;
  const series = [0];
  for (let index = 1; index < closes.length; index += 1) {
    const volume = Math.max(0, finiteOr(volumes[index], 0));
    if (closes[index] > closes[index - 1]) obv += volume;
    else if (closes[index] < closes[index - 1]) obv -= volume;
    series.push(obv);
  }

  const recent = series.slice(-period);
  const scale = Math.max(...series.map((value) => Math.abs(value)), 1);
  return (recent.at(-1) - recent[0]) / scale;
}

function stdDev(values) {
  if (!values.length) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function pctChange(from, to) {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === 0) return 0;
  return round(((to - from) / from) * 100, 2);
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(Math.max(number, min), max);
}

function round(value, precision = 2) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** precision;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function finiteOr(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function pickValidPrice(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) return number;
  }

  return NaN;
}

function getPrecision(price) {
  if (price < 0.01) return 6;
  if (price < 1) return 4;
  if (price < 10) return 3;
  return 2;
}
