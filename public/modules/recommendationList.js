import { getAnalysisMetrics } from "./analysisMetrics.js";

// Only the recommendation list is rebuilt when its query or sort order changes.
export function createRecommendationListRenderer({ cards, template, expandedSignalCards, getPremiumAssetVisual, getOfficialCompanyName,
  setupSignalCardToggle, formatMoney, formatNumber, formatPercent, isEnglishLanguage,
  formatDataFreshness, localizeUiText, renderTimeframePills, drawSparkline,
  attachDetailOpeners, renderMarketDataState }) {
  return function renderRecommendationList(data, recommendations) {
  cards.innerHTML = "";

  if (!recommendations.length) {
    cards.innerHTML = renderMarketDataState(data);
  }

  for (const item of recommendations) {
    const card = template.content.firstElementChild.cloneNode(true);
    const actionBadge = card.querySelector(".action-badge");
    const shariaBadge = card.querySelector(".sharia-badge");
    const metrics = getAnalysisMetrics(item, { english: isEnglishLanguage(), localize: localizeUiText });
    const visual = getPremiumAssetVisual(item);
    const logo = card.querySelector(".signal-asset-logo");

    card.querySelector(".asset-name").textContent = getOfficialCompanyName(item);
    card.querySelector(".asset-symbol").textContent = `${item.symbol}${item.exchangeName ? ` · ${item.exchangeName}` : ""}`;
    if (logo) {
      logo.className = `asset-logo signal-asset-logo ${visual.className}`;
      logo.innerHTML = visual.html;
    }
    card.dataset.symbol = item.symbol;
    card.setAttribute("role", "link");
    card.tabIndex = 0;
    card.title = "افتح صفحة تفاصيل السهم";
    setupSignalCardToggle(card, item);
    actionBadge.textContent = item.actionLabel;
    actionBadge.classList.add(`action-${item.action}`);
    if (item.shariaStatus === "compliant") {
      shariaBadge.textContent = item.shariaLabel || "مطابق للشريعة";
      shariaBadge.title = item.shariaSource || "تصنيف شرعي قابل للتحديث";
      shariaBadge.classList.add("is-visible");
    }
    card.querySelector(".current-price").textContent = formatMoney(item.currentPrice, item.currency);
    card.querySelector(".expected-price").textContent = formatMoney(item.expectedPrice, item.currency);
    card.querySelector(".target-one").textContent = formatMoney(item.target1 || item.expectedPrice, item.currency);
    card.querySelector(".target-two").textContent = formatMoney(item.target2, item.currency);
    card.querySelector(".stop-loss").textContent = item.stopLoss ? formatMoney(item.stopLoss, item.currency) : "--";
    card.querySelector(".risk-reward").textContent = item.riskReward ? `${formatNumber(item.riskReward, { maximumFractionDigits: 2 })}:1` : "--";
    for (const key of ["confidence", "duration", "score"]) {
      const cell = card.querySelector('[data-analysis-metric="' + key + '"]');
      cell.querySelector(".analysis-metric-label").textContent = metrics[key + "Label"];
      cell.querySelector("[data-metric-value]").textContent = key === "duration" ? metrics.duration : metrics[key + "Text"];
    }
    card.querySelector('[data-analysis-metric="score"]').title = metrics.scoreDescription;
    card.querySelector(".expected-move").textContent = `الحركة: ${formatPercent(item.expectedMovePct)}`;
    card.querySelector(".data-source").textContent = isEnglishLanguage()
      ? `Source: ${item.dataProvenance?.provider || item.dataProvider || "--"}`
      : `المصدر: ${item.dataProvenance?.provider || item.dataProvider || "--"}`;
    card.querySelector(".data-freshness").textContent = formatDataFreshness(item.dataProvenance);
    card.querySelector(".rsi").textContent = item.indicators?.rsi14 ?? "--";
    card.querySelector(".momentum").textContent = formatPercent(item.indicators?.momentum20 ?? 0);
    card.querySelector(".volatility").textContent = formatPercent(item.indicators?.volatility20 ?? 0);
    card.querySelector(".risk-label").textContent = item.risk?.label || "--";
    card.querySelector(".backtest-label").textContent = item.backtest?.winRate ? `${item.backtest.winRate}%` : item.backtest?.label || "--";
    card.querySelector(".data-health-label").textContent = item.dataHealth?.score ? `${item.dataHealth.score}% ${item.dataHealth.label || ""}`.trim() : "--";
    card.querySelector(".timeframe-grid").innerHTML = renderTimeframePills(item.timeframes || []);

    const reasons = card.querySelector(".reasons");
    reasons.innerHTML = "";
    for (const reason of Array.isArray(item.reasons) ? item.reasons : []) {
      const li = document.createElement("li");
      li.textContent = reason;
      reasons.appendChild(li);
    }

    cards.appendChild(card);
    if (expandedSignalCards.has(item.symbol)) {
      drawSparkline(card.querySelector(".sparkline"), item.sparkline, item.action);
    }
  }

  attachDetailOpeners(cards);

  };
}
