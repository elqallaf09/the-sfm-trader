const params = new URLSearchParams(window.location.search);
const symbol = params.get("symbol") || "";
const NUMBER_LOCALE = "ar-KW-u-nu-latn";
const NUMBER_OPTIONS = { numberingSystem: "latn" };

const elements = {
  status: document.querySelector("#detail-status"),
  symbol: document.querySelector("#detail-symbol"),
  name: document.querySelector("#detail-name"),
  market: document.querySelector("#detail-market"),
  heading: document.querySelector("#detail-heading"),
  summary: document.querySelector("#detail-summary"),
  action: document.querySelector("#detail-action"),
  confidence: document.querySelector("#detail-confidence"),
  agreement: document.querySelector("#detail-agreement"),
  currentPrice: document.querySelector("#detail-current-price"),
  expectedPrice: document.querySelector("#detail-expected-price"),
  targetOne: document.querySelector("#detail-target-one"),
  targetTwo: document.querySelector("#detail-target-two"),
  stopLoss: document.querySelector("#detail-stop-loss"),
  support: document.querySelector("#detail-support"),
  resistance: document.querySelector("#detail-resistance"),
  riskReward: document.querySelector("#detail-risk-reward"),
  expectedMove: document.querySelector("#detail-expected-move"),
  duration: document.querySelector("#detail-duration"),
  score: document.querySelector("#detail-score"),
  risk: document.querySelector("#detail-risk"),
  quality: document.querySelector("#detail-quality"),
  dataHealth: document.querySelector("#detail-data-health"),
  decisionPanel: document.querySelector("#decision-panel"),
  decisionTitle: document.querySelector("#decision-title"),
  decisionMessage: document.querySelector("#decision-message"),
  decisionBadge: document.querySelector("#decision-badge"),
  generalInfo: document.querySelector("#general-info"),
  shariaBox: document.querySelector("#sharia-box"),
  timeframes: document.querySelector("#detail-timeframes"),
  outlook: document.querySelector("#outlook-detail-list"),
  reasons: document.querySelector("#detail-reasons"),
  sparkline: document.querySelector("#detail-sparkline"),
  backtest: document.querySelector("#backtest-detail")
};

initMarketBackground();
registerPwaServiceWorker();
loadDetail();

function registerPwaServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  });
}

async function loadDetail() {
  if (!symbol) {
    showError("لم يتم تحديد رمز السهم.");
    return;
  }

  try {
    elements.status.textContent = "جاري تحليل السهم";
    const response = await fetch(`/api/asset?symbol=${encodeURIComponent(symbol)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "تعذر تحميل تفاصيل السهم");
    }

    renderDetail(data);
    elements.status.textContent = data.cached ? "بيانات مخزنة لحظياً" : "تحليل جديد";
  } catch (error) {
    showError(error.message);
  }
}

function renderDetail(data) {
  const item = data.recommendation;
  const profile = data.profile || {};
  const market = data.market || {};
  const finalScore = calculateFinalScore(item);
  const decision = item.decision || buildDecision(item);

  document.title = `${item.symbol} - the-sfm trader`;
  elements.symbol.textContent = item.symbol;
  elements.name.textContent = item.name;
  elements.market.textContent = `${market.label || profile.marketLabel || "--"} · ${profile.exchangeName || item.exchangeName || "--"}`;
  elements.heading.textContent = `${item.name} (${item.symbol})`;
  elements.summary.textContent = profile.summary || "لا تتوفر معلومات وصفية كافية لهذا الرمز.";

  elements.action.textContent = item.actionLabel;
  elements.action.className = `action-badge action-${item.action}`;
  elements.confidence.textContent = `${item.confidence}% ثقة`;
  elements.agreement.textContent = `توافق الفريمات ${item.timeframeConsensus?.agreementPct || 0}% · تغطية ${item.timeframeConsensus?.coverage || 0}/${item.timeframeConsensus?.total || 0}`;

  elements.currentPrice.textContent = formatMoney(item.currentPrice, item.currency);
  elements.expectedPrice.textContent = formatMoney(item.expectedPrice, item.currency);
  elements.targetOne.textContent = formatMoney(item.target1 || item.expectedPrice, item.currency);
  elements.targetTwo.textContent = formatMoney(item.target2, item.currency);
  elements.stopLoss.textContent = item.stopLoss ? formatMoney(item.stopLoss, item.currency) : "--";
  elements.support.textContent = formatMoney(item.support, item.currency);
  elements.resistance.textContent = formatMoney(item.resistance, item.currency);
  elements.riskReward.textContent = item.riskReward ? `${formatNumber(item.riskReward, { maximumFractionDigits: 2 })}:1` : "--";
  elements.expectedMove.textContent = formatPercent(item.expectedMovePct);
  elements.duration.textContent = item.duration;
  elements.score.textContent = `${finalScore.score}% · ${finalScore.label}`;
  elements.risk.textContent = item.risk?.label || "--";
  elements.quality.textContent = item.analysisQuality ? `${item.analysisQuality.score}% · ${item.analysisQuality.label}` : "--";
  elements.dataHealth.textContent = item.dataHealth ? `${item.dataHealth.score}% · ${item.dataHealth.label || "صحة البيانات"}` : "--";

  elements.decisionPanel.className = `decision-panel decision-${decision.kind}`;
  elements.decisionTitle.textContent = decision.title;
  elements.decisionMessage.textContent = decision.message;
  elements.decisionBadge.textContent = decision.badge;
  elements.decisionBadge.className = `decision-badge decision-${decision.kind}`;

  renderGeneralInfo(profile, market, item);
  renderSharia(profile);
  renderTimeframes(item.timeframes || []);
  renderOutlook(item);
  renderReasons(item.reasons || []);
  renderBacktest(item);
  drawSparkline(elements.sparkline, item.sparkline || [], item.action);
}

function renderGeneralInfo(profile, market, item) {
  elements.generalInfo.innerHTML = `
    ${renderInfoRow("الاختصاص", profile.specialty || "--")}
    ${renderInfoRow("السوق", profile.marketLabel || market.label || "--")}
    ${renderInfoRow("المنطقة", profile.region || market.region || "--")}
    ${renderInfoRow("البورصة", profile.exchangeName || item.exchangeName || "--")}
    ${renderInfoRow("العملة", profile.currency || item.currency || "--")}
    ${renderInfoRow("حالة السوق", item.marketState || "--")}
    ${renderInfoRow("ملاحظة المزود", item.providerDelayNote || market.note || "--")}
    ${renderInfoRow("حجم التداول النسبي", item.relativeVolume ? `${formatNumber(item.relativeVolume, { maximumFractionDigits: 2 })}x` : "--")}
    ${renderInfoRow("VWAP", item.indicators?.vwap ? formatMoney(item.indicators.vwap, item.currency) : "--")}
  `;
}

function renderSharia(profile) {
  const statusClass = profile.shariaStatus === "compliant" ? "buy" : profile.shariaStatus === "not_compliant" ? "sell" : "hold";
  elements.shariaBox.innerHTML = `
    <div class="sharia-status-detail ${statusClass}">
      <strong>${escapeHtml(profile.shariaLabel || "غير معروف")}</strong>
      <span>${escapeHtml(profile.shariaDescription || "لا يوجد تصنيف شرعي مؤكد.")}</span>
    </div>
    <div class="info-list">
      ${renderInfoRow("المصدر", profile.shariaSource || "تصنيف داخلي قابل للتحديث")}
      ${renderInfoRow("آخر مراجعة", profile.shariaCheckedAt || "--")}
    </div>
  `;
}

function renderTimeframes(timeframes) {
  const wanted = new Set(["1m", "15m", "30m", "1h", "1d", "1wk", "1mo"]);
  const frames = timeframes.filter((frame) => wanted.has(frame.id));

  if (!frames.length) {
    elements.timeframes.innerHTML = "<div class=\"empty\">الفريمات غير مكتملة لهذا الرمز حالياً.</div>";
    return;
  }

  elements.timeframes.innerHTML = frames.map((frame) => {
    const actionClass = frame.action === "buy" ? "buy" : frame.action === "sell" ? "sell" : "hold";
    return `
      <article class="timeframe-detail ${actionClass}">
        <div>
          <span>${escapeHtml(frame.label)}</span>
          <strong>${escapeHtml(frame.actionLabel)}</strong>
        </div>
        <div>
          <span>الثقة</span>
          <strong>${frame.confidence}%</strong>
        </div>
        <div>
          <span>RSI</span>
          <strong>${frame.rsi14}</strong>
        </div>
        <div>
          <span>الزخم</span>
          <strong>${formatPercent(frame.momentum20)}</strong>
        </div>
        <div>
          <span>الاتجاه</span>
          <strong>${escapeHtml(frame.trend)}</strong>
        </div>
      </article>
    `;
  }).join("");
}

function renderOutlook(item) {
  const outlook = item.upsideOutlook || [];
  if (!outlook.length) {
    elements.outlook.innerHTML = "<div class=\"empty\">لا توجد أهداف شهرية متاحة لهذا الرمز.</div>";
    return;
  }

  elements.outlook.innerHTML = outlook.map((entry) => `
    <article class="outlook-detail-item">
      <span>${escapeHtml(entry.label)}</span>
      <strong>${formatMoney(entry.targetPrice, item.currency)}</strong>
      <em>${formatPercent(entry.movePct)} · ${entry.confidence}% ثقة</em>
    </article>
  `).join("");
}

function renderReasons(reasons) {
  elements.reasons.innerHTML = reasons.length
    ? reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")
    : "<li>لا توجد أسباب كافية لهذا الرمز حالياً.</li>";
}

function renderBacktest(item) {
  elements.backtest.innerHTML = `
    ${renderInfoRow("معدل النجاح", item.backtest?.winRate ? `${item.backtest.winRate}%` : item.backtest?.label || "--")}
    ${renderInfoRow("عدد العينات", item.backtest?.samples ?? "--")}
    ${renderInfoRow("أفق الاختبار", item.backtest?.horizonDays ? `${item.backtest.horizonDays} يوم` : "--")}
    ${renderInfoRow("متوسط العائد", Number.isFinite(item.backtest?.avgReturnPct) ? formatPercent(item.backtest.avgReturnPct) : "--")}
    ${renderInfoRow("جودة التحليل", item.analysisQuality ? `${item.analysisQuality.score}% · ${item.analysisQuality.label}` : "--")}
    ${renderInfoRow("خطة التنفيذ", item.tradePlan?.note || "--")}
    ${renderInfoRow("ملاحظات المخاطرة", item.risk?.notes?.join("، ") || "--")}
  `;
}

function buildDecision(item) {
  const agreement = item.timeframeConsensus?.agreementPct || 0;

  if (item.action === "buy" && item.confidence >= 70 && agreement >= 60 && item.risk?.level !== "high") {
    return {
      kind: "buy",
      badge: "اشتر الآن",
      title: "إشارة شراء قوية",
      message: `الفريمات متوافقة بنسبة ${agreement}% والثقة ${item.confidence}%. راقب السعر والهدف قبل التنفيذ.`
    };
  }

  if (item.action === "sell" && item.confidence >= 65) {
    return {
      kind: "sell",
      badge: "بيع الآن",
      title: "إشارة بيع واضحة",
      message: `الاتجاه يميل للبيع بثقة ${item.confidence}%. تجنب الدخول الشرائي حتى تتغير الفريمات.`
    };
  }

  return {
    kind: "hold",
    badge: "انتظر",
    title: "لا تتداول هذا السهم الآن",
    message: "الإشارات غير كافية أو متضاربة. الأفضل الانتظار حتى تتوافق فريمات الدخول مع اليومي."
  };
}

function renderInfoRow(label, value) {
  return `
    <div class="info-row">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function showError(message) {
  elements.status.textContent = "تعذر التحميل";
  document.querySelector("#detail-content").innerHTML = `<div class="empty">${escapeHtml(message)}</div>`;
}

function calculateFinalScore(item) {
  const confidencePoints = clamp(Number(item.confidence || 0), 0, 100) * 0.35;
  const agreementPoints = clamp(Number(item.timeframeConsensus?.agreementPct || 0), 0, 100) * 0.15;
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
  const winRate = Number(item.backtest?.winRate);
  const backtestPoints = Number.isFinite(winRate) ? clamp(winRate * 0.1, 0, 10) : 4;
  const movePoints = clamp(Math.abs(Number(item.expectedMovePct || 0)) * 1.2, 0, 5);
  const qualityPoints = clamp(Number(item.analysisQuality?.score || 0), 0, 100) * 0.08;
  const riskRewardPoints = clamp(Number(item.riskReward || 0), 0, 3) * 2;
  const conflictPenalty = item.timeframeConsensus?.conflict ? 6 : 0;
  const score = Math.round(clamp(confidencePoints + agreementPoints + shariaPoints + riskPoints + backtestPoints + movePoints + qualityPoints + riskRewardPoints - conflictPenalty, 0, 100));
  const label = score >= 80 ? "قوي جداً" : score >= 70 ? "قوي" : score >= 55 ? "متوسط" : "ضعيف";

  return { score, label };
}

function drawSparkline(canvas, values = [], action) {
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);

  const data = values.filter(Number.isFinite);
  if (data.length < 2) return;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 16;
  const width = rect.width - pad * 2;
  const height = rect.height - pad * 2;
  const lineColor = action === "sell" ? "#ff6b6b" : action === "hold" ? "#91a7ff" : "#65d98d";

  context.strokeStyle = "rgba(135, 154, 172, 0.18)";
  context.lineWidth = 1;
  for (let index = 1; index <= 3; index += 1) {
    const y = pad + (height / 4) * index;
    context.beginPath();
    context.moveTo(pad, y);
    context.lineTo(rect.width - pad, y);
    context.stroke();
  }

  context.strokeStyle = lineColor;
  context.lineWidth = 2.5;
  context.beginPath();
  data.forEach((value, index) => {
    const x = pad + (index / (data.length - 1)) * width;
    const y = pad + height - ((value - min) / range) * height;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();
}

function initMarketBackground() {
  const canvas = document.querySelector("#market-bg");
  const context = canvas.getContext("2d");
  const rows = Array.from({ length: 8 }, (_, index) => ({
    y: 80 + index * 92,
    phase: Math.random() * 100,
    speed: 0.35 + Math.random() * 0.45,
    color: index % 3 === 0 ? "53, 194, 164" : index % 3 === 1 ? "255, 107, 107" : "90, 167, 255"
  }));

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.strokeStyle = "rgba(135, 154, 172, 0.055)";
    for (let x = 0; x < window.innerWidth; x += 72) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, window.innerHeight);
      context.stroke();
    }

    for (const row of rows) {
      row.phase += row.speed;
      context.strokeStyle = `rgba(${row.color}, 0.2)`;
      context.beginPath();
      for (let x = -20; x <= window.innerWidth + 20; x += 18) {
        const wave = Math.sin((x + row.phase * 3) * 0.012) * 18 + Math.cos((x - row.phase) * 0.027) * 9;
        const y = (row.y + row.phase * 0.12 + wave) % (window.innerHeight + 120);
        if (x === -20) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }

    window.requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  frame();
}

function formatMoney(value, currency) {
  if (value === null || value === undefined || value === "") return "--";
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  const digits = Math.abs(number) < 1 ? 4 : 2;
  return `${formatNumber(number, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })}${currency ? ` ${currency}` : ""}`;
}

function formatPercent(value) {
  const number = Number(value || 0);
  const prefix = number > 0 ? "+" : "";
  return `${prefix}${formatNumber(number, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`;
}

function formatNumber(value, options = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return number.toLocaleString(NUMBER_LOCALE, {
    ...NUMBER_OPTIONS,
    ...options
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}
