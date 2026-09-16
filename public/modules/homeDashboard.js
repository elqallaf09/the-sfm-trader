import { toNullableNumber } from "./numberValue.js?v=20260914-issue40-1";
import { escapeHtml, safeHttpUrl } from "./html.js?v=20260914-audit-repair-1";
import { getAnalysisMetrics } from "./analysisMetrics.js?v=20260914-issue40-1";
import { renderAssetLogo, getOfficialCompanyName } from "./assetBranding.js?v=20260914-audit-repair-1";

export function getDashboardRecommendations(data = {}) {
  const source = Array.isArray(data?.recommendations) ? data.recommendations : [];
  return source.filter((item) => item && typeof item === "object" && String(item.symbol || "").trim());
}

export function createHomeDashboard({ calculateFinalScore, clamp, localizeUiText, formatNumber, formatPercent,
  formatDateTime, formatMoney, getMarketPulse, attachDetailOpeners,
  isEnglishLanguage, getFollowedEntries, reload }) {
function setTerminalHomeV3State(kind = "loading") {
  const root = document.querySelector("#terminal-home-v3");
  if (!root) return;

  const unavailable = kind === "offline" || kind === "unavailable";
  const state = unavailable ? "unavailable" : "loading";
  const message = unavailable
    ? "تعذر الاتصال بمزود بيانات السوق. لا توجد قيم بديلة معروضة."
    : "جارٍ تحميل بيانات السوق من مزود موثوق.";

  root.dataset.uiState = state;
  root.setAttribute("aria-busy", String(!unavailable));

  const setText = (selector, value) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = localizeUiText(value);
  };

  setText("#v3-confidence", "--");
  setText("#v3-market-bias", unavailable ? "غير متاح" : "جارٍ التحميل");
  setText("#v3-market-summary", message);
  setText("#v3-buy-count", "--");
  setText("#v3-sell-count", "--");
  setText("#v3-hold-count", "--");
  setText("#v3-pulse-change", "--");
  setText("#v3-pulse-label", unavailable ? "غير متاح" : "جارٍ التحميل");
  setText("#v3-pulse-assets", unavailable ? "لا توجد بيانات مكتملة" : "جارٍ تحميل الأصول");
  setText("#v3-pulse-updated", "آخر تحديث --");
  setText("#v3-heatmap-leader", "--");

  const confidenceRing = root.querySelector("#v3-confidence-ring");
  if (confidenceRing) {
    confidenceRing.style.setProperty("--v3-confidence", "0%");
    confidenceRing.setAttribute("aria-label", localizeUiText(unavailable ? "ثقة التحليل غير متاحة" : "جارٍ تحميل ثقة التحليل"));
  }

  const stateMarkup = (panelMessage) => renderV3EmptyState(panelMessage, { kind: state });
  const panels = [
    ["#v3-pulse-chart", unavailable ? "بيانات حركة الأصول غير متاحة حالياً." : "جارٍ تحميل توزيع حركة الأصول."],
    ["#v3-opportunity-grid", unavailable ? "لا توجد فرص موثوقة لعرضها حالياً." : "جارٍ تحميل الفرص الموثقة."],
    ["#v3-heatmap-grid", unavailable ? "خريطة حركة الأصول غير متاحة حالياً." : "جارٍ تحميل خريطة حركة الأصول."],
    ["#v3-followed-list", unavailable ? "تعذر تحميل الصفقات المتابعة." : "جارٍ تحميل الصفقات المتابعة."],
    ["#v3-calendar-list", unavailable ? "الأحداث الاقتصادية غير متاحة حالياً." : "جارٍ تحميل الأحداث الاقتصادية."]
  ];
  for (const [selector, panelMessage] of panels) {
    const panel = root.querySelector(selector);
    if (panel) {
      panel.innerHTML = stateMarkup(panelMessage);
      if (unavailable && selector === "#v3-opportunity-grid") {
        const retry = document.createElement("button");
        retry.type = "button";
        retry.className = "v3-empty-action";
        retry.dataset.homeRetry = "true";
        retry.textContent = localizeUiText("إعادة المحاولة");
        retry.addEventListener("click", () => reload());
        panel.querySelector(".v3-panel-state")?.append(retry);
      }
    }
  }
}

function getDashboardScore(item) {
  try {
    const score = Number(calculateFinalScore(item)?.score);
    return Number.isFinite(score) ? clamp(score, 0, 100) : clamp(Number(item?.confidence || 0), 0, 100);
  } catch (error) {
    console.warn("[SFM dashboard] score fallback", item?.symbol, error);
    return clamp(Number(item?.confidence || 0), 0, 100);
  }
}

function renderTerminalHomeV3(data = {}) {
  const root = document.querySelector("#terminal-home-v3");
  if (!root) return;

  const items = getDashboardRecommendations(data);
  const buys = items.filter((item) => item.action === "buy");
  const sells = items.filter((item) => item.action === "sell");
  const holds = items.filter((item) => item.action !== "buy" && item.action !== "sell");
  const confidences = items.map(item => getAnalysisMetrics(item).confidence).filter(value => value !== null);
  const averageConfidence = confidences.length
    ? Math.round(confidences.reduce((sum, value) => sum + value, 0) / confidences.length)
    : 0;
  const moves = items.map(item => toNullableNumber(item.expectedMovePct)).filter(value => value !== null);
  const averageMove = moves.length ? moves.reduce((sum,value) => sum+value,0)/moves.length : null;
  const bias = buys.length > sells.length ? "صاعد" : sells.length > buys.length ? "هابط" : "محايد";
  const ranked = [...items].sort((a, b) => getDashboardScore(b) - getDashboardScore(a));
  const quotesNeedUpdate = items.some(item => ["stale", "unknown"].includes(item.priceFreshness?.state));
  const state = items.length ? (data.stale ? "stale" : quotesNeedUpdate ? "stale" : "fresh") : data.partial ? "loading" : "empty";
  root.dataset.uiState = state;
  root.setAttribute("aria-busy", "false");

  const setText = (selector, value) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };

  setText("#v3-confidence", confidences.length ? `${formatNumber(averageConfidence)}%` : "--");
  setText("#v3-buy-count", formatNumber(buys.length));
  setText("#v3-sell-count", formatNumber(sells.length));
  setText("#v3-hold-count", formatNumber(holds.length));
  setText("#v3-market-bias", localizeUiText(bias));
  setText("#v3-pulse-change", averageMove !== null ? formatPercent(averageMove) : "--");
  setText("#v3-pulse-label", items.length ? localizeUiText(getMarketPulse(items)) : localizeUiText("بانتظار البيانات"));
  setText("#v3-pulse-assets", items.length ? `${localizeUiText("الأصول المحللة")}: ${formatNumber(items.length)}` : localizeUiText("لا توجد بيانات مكتملة"));
  setText("#v3-pulse-updated", data.generatedAt ? `${localizeUiText("آخر تحديث")} ${formatDateTime(data.generatedAt)}` : localizeUiText("آخر تحديث --"));

  const confidenceRing = root.querySelector("#v3-confidence-ring");
  if (confidenceRing) {
    confidenceRing.style.setProperty("--v3-confidence", `${clamp(averageConfidence, 0, 100)}%`);
    confidenceRing.setAttribute("aria-label", confidences.length ? `${localizeUiText("ثقة التحليل")} ${formatNumber(averageConfidence)}%` : localizeUiText("ثقة التحليل غير متاحة"));
  }

  const english = isEnglishLanguage();
  const marketSummary = items.length
    ? bias === "محايد"
      ? english
        ? `The market is balanced; ${formatNumber(holds.length)} of ${formatNumber(items.length)} assets are waiting for stronger confirmation before a decision.`
        : `السوق متوازن حالياً؛ ${formatNumber(holds.length)} من ${formatNumber(items.length)} أصلاً بانتظار تأكيد أقوى قبل اتخاذ القرار.`
      : english
        ? `The market is trending ${bias === "صاعد" ? "upward" : "downward"} with ${formatNumber(Math.max(buys.length, sells.length))} confirmed signals across ${formatNumber(items.length)} analyzed assets.`
        : `يميل السوق إلى اتجاه ${bias} مع ${formatNumber(Math.max(buys.length, sells.length))} إشارات مؤكدة من أصل ${formatNumber(items.length)} أصلاً محللاً.`
    : english
      ? "Waiting for verified market-provider data. The terminal will not display substitute prices or signals."
      : "بانتظار وصول بيانات موثوقة من مزود السوق. لن تعرض المنصة أسعاراً أو إشارات بديلة.";
  setText("#v3-market-summary", marketSummary);

  const opportunityGrid = root.querySelector("#v3-opportunity-grid");
  if (opportunityGrid) {
    opportunityGrid.innerHTML = ranked.length
      ? ranked.slice(0, 3).map(renderV3Opportunity).join("")
      : renderV3EmptyState("لا توجد فرص موثوقة متاحة حالياً.");
    attachDetailOpeners(opportunityGrid);
  }

  const heatmapGrid = root.querySelector("#v3-heatmap-grid");
  const heatItems = ranked.slice(0, 8);
  if (heatmapGrid) {
    heatmapGrid.innerHTML = heatItems.length
      ? heatItems.map(renderV3HeatItem).join("")
      : renderV3EmptyState("تظهر خريطة الحرارة بعد اكتمال تحليل السوق.");
    attachDetailOpeners(heatmapGrid);
  }
  setText("#v3-heatmap-leader", heatItems[0] ? `${heatItems[0].symbol} · ${getAnalysisMetrics(heatItems[0], { english, localize: localizeUiText }).scoreText}` : "--");

  const pulseChart = root.querySelector("#v3-pulse-chart");
  if (pulseChart) pulseChart.innerHTML = renderV3PulseChart(items);

  const followedList = root.querySelector("#v3-followed-list");
  if (followedList) {
    const followed = getFollowedEntries().slice(0, 3);
    followedList.innerHTML = followed.length
      ? followed.map(renderV3FollowedTrade).join("")
      : renderV3EmptyState("لا توجد صفقات محفوظة تحت المتابعة.", { view: "recommendations", actionLabel: "استعرض التوصيات" });
    attachDetailOpeners(followedList);
  }

  renderCalendar(data.economicCalendar);
}

function renderCalendar(calendar = {}) {
  calendar = calendar && typeof calendar === "object" ? calendar : {};
  const calendarList = document.querySelector("#v3-calendar-list");
  if (!calendarList) return;
  const events = [...(calendar.hotEvents || []), ...(calendar.upcoming || []), ...(calendar.recent || [])]
    .filter(Boolean)
    .filter((event, index, list) => list.findIndex(candidate => candidate.title === event.title && candidate.currency === event.currency && candidate.isoTime === event.isoTime) === index)
    .slice(0, 3);
  calendarList.dataset.uiState = calendar.dataState || (events.length ? "fresh" : "empty");
  calendarList.innerHTML = events.length
    ? events.map(renderV3CalendarEvent).join("")
    : renderV3EmptyState(calendar.summary || (calendar.dataState === "unavailable" ? "تعذر تحميل التقويم الاقتصادي من المصدر." : "لا توجد أحداث اقتصادية موثقة قريبة."), { kind: calendar.dataState || "empty" });
}

function renderV3Opportunity(item) {
  const tone = item.action === "buy" ? "buy" : item.action === "sell" ? "sell" : "hold";
  const metrics = getAnalysisMetrics(item, { english: isEnglishLanguage(), localize: localizeUiText });
  const target = metrics.target;
  const confidence = metrics.confidence ?? 0;
  const companyName = getOfficialCompanyName(item);
  return `<article class="v3-opportunity-card ${tone}" data-symbol="${escapeHtml(item.symbol)}" tabindex="0" role="link">
    <header>${renderAssetLogo(item, { className: "v3-asset-logo" })}<div><strong>${escapeHtml(item.symbol)}</strong><span>${escapeHtml(companyName)}</span></div><b>${escapeHtml(localizeUiText(item.actionLabel || item.action || "انتظار"))}</b></header>
    <div class="v3-opportunity-metrics"><div><span>${escapeHtml(localizeUiText("السعر الحالي"))}</span><strong>${formatMoney(item.currentPrice, item.currency, { symbol: item.symbol })}</strong></div><div><span>${escapeHtml(localizeUiText("الهدف"))}</span><strong>${target !== null ? formatMoney(target, item.currency, { symbol: item.symbol }) : escapeHtml(metrics.unavailable)}</strong></div><div class="v3-confidence-metric"><span>${escapeHtml(localizeUiText("ثقة التحليل"))}</span><span class="v3-card-confidence" style="--v3-card-confidence:${confidence}%" aria-label="${escapeHtml(`${metrics.confidenceLabel}: ${metrics.confidenceText}`)}" data-metric-value="confidence"><i>${escapeHtml(metrics.confidenceRingText)}</i></span></div></div>
    <div class="analysis-summary v3-analysis-summary" aria-label="${escapeHtml(isEnglishLanguage() ? "Analysis information" : "معلومات التحليل")}">
      <div data-analysis-metric="duration"><span class="analysis-metric-label">${metrics.durationLabel}</span><strong data-metric-value="duration" dir="auto">${escapeHtml(metrics.duration)}</strong></div>
      <div data-analysis-metric="score" title="${escapeHtml(metrics.scoreDescription)}"><span class="analysis-metric-label">${metrics.scoreLabel}</span><strong data-metric-value="score" dir="ltr">${escapeHtml(metrics.scoreText)}</strong></div>
    </div>
  </article>`;
}

function renderV3HeatItem(item) {
  const tone = item.action === "buy" ? "buy" : item.action === "sell" ? "sell" : "hold";
  const metrics = getAnalysisMetrics(item, { english: isEnglishLanguage(), localize: localizeUiText });
  return `<article class="v3-heat-item ${tone}" data-symbol="${escapeHtml(item.symbol)}" tabindex="0" role="link">${renderAssetLogo(item, { className: "v3-heat-logo" })}<strong>${escapeHtml(item.symbol)}</strong><b>${formatPercent(item.expectedMovePct)}</b><span>${escapeHtml(localizeUiText(item.actionLabel || item.action || "انتظار"))}</span><em>${escapeHtml(metrics.confidenceText)}</em></article>`;
}

function renderV3PulseChart(items) {
  if (!items.length) return renderV3EmptyState("بانتظار بيانات حركة الأصول.");
  const values = items.slice(0, 20)
    .map((item) => toNullableNumber(item.expectedMovePct))
    .filter(value => value !== null)
    .sort((a, b) => a - b);
  if (!values.length) return renderV3EmptyState("لا توجد توقعات حركة متاحة.");
  const max = Math.max(1, ...values.map((value) => Math.abs(value)));
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
    const y = 50 - (value / max) * 34;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const areaPoints = `0,50 ${points} 100,50`;
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="${escapeHtml(localizeUiText("توزيع الحركة المتوقعة للأصول — ليس شارت أسعار"))}"><defs><linearGradient id="v3-pulse-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#2fd6c0" stop-opacity=".32"></stop><stop offset="100%" stop-color="#2fd6c0" stop-opacity="0"></stop></linearGradient></defs><g class="v3-pulse-grid"><line x1="0" y1="16" x2="100" y2="16"></line><line x1="0" y1="33" x2="100" y2="33"></line><line x1="0" y1="50" x2="100" y2="50"></line><line x1="0" y1="67" x2="100" y2="67"></line><line x1="0" y1="84" x2="100" y2="84"></line></g><polygon points="${areaPoints}"></polygon><polyline points="${points}"></polyline></svg>`;
}

function renderV3FollowedTrade(entry) {
  const entryPrice = toNullableNumber(entry.entryPrice ?? entry.currentPrice);
  const target = toNullableNumber(entry.target1 ?? entry.expectedPrice);
  const status = entry.outcome === "target" ? "وصل الهدف" : entry.outcome === "stop" ? "صفقة خاسرة" : "قيد المتابعة";
  return `<article class="v3-follow-row" data-symbol="${escapeHtml(entry.symbol)}" tabindex="0" role="link">${renderAssetLogo(entry, { className: "v3-follow-logo" })}<strong>${escapeHtml(entry.symbol)}</strong><span class="v3-follow-action">${escapeHtml(localizeUiText(entry.actionLabel || entry.action || "انتظار"))}</span><span class="v3-follow-price"><small>${escapeHtml(localizeUiText("الدخول"))}</small><b>${Number.isFinite(entryPrice) ? formatMoney(entryPrice, entry.currency || "USD") : "--"}</b></span><span class="v3-follow-price"><small>${escapeHtml(localizeUiText("الهدف"))}</small><b>${Number.isFinite(target) ? formatMoney(target, entry.currency || "USD") : "--"}</b></span><em class="is-${escapeHtml(entry.outcome || "pending")}">${escapeHtml(localizeUiText(status))}</em></article>`;
}

function renderV3CalendarEvent(event) {
  const impact = event.impact === "high" ? "high" : event.impact === "low" ? "low" : "medium";
  const impactLabel = impact === "high" ? "عالي" : impact === "low" ? "منخفض" : "متوسط";
  const date = event.date || (event.isoTime ? formatDateTime(event.isoTime).split(" ")[0] : "--");
  const timing = event.exactTime === false ? localizeUiText("موعد غير محدد") : event.localTimeLabel || event.time || "--";
  const url = safeHttpUrl(event.url);
  return `<article class="v3-calendar-event ${impact}"><header><span>${escapeHtml(event.currency || "--")}</span><time>${escapeHtml(date)} · ${escapeHtml(timing)}</time></header><strong>${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(event.title || "--")}</a>` : escapeHtml(event.title || "--")}</strong><b>${escapeHtml(localizeUiText(impactLabel))}</b></article>`;
}

function renderV3EmptyState(message, options = {}) {
  const action = options.view
    ? `<a href="#view-${escapeHtml(options.view)}" class="v3-view-all v3-empty-action" data-v3-view="${escapeHtml(options.view)}">${escapeHtml(localizeUiText(options.actionLabel || "استعرض التوصيات"))}</a>`
    : "";
  const kind = options.kind || "empty";
  const role = kind === "unavailable" ? "alert" : "status";
  return `<div class="v3-empty-state v3-panel-state" data-ui-state="${escapeHtml(kind)}" role="${role}"><p>${escapeHtml(localizeUiText(message))}</p>${action}</div>`;
}


  return { render: renderTerminalHomeV3, renderCalendar, setState: setTerminalHomeV3State, score: getDashboardScore };
}
