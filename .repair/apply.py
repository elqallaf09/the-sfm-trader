from pathlib import Path
root = Path('.')
p = root/'public/app.js'
s = p.read_text(encoding='utf-8-sig')
assert 'function sfmFinalNormalizeRecommendationRows' in s
assert 'createSymbolDetailStore' not in s
s=s.replace('import { fetchJsonWithPolicy, fetchResponseWithPolicy } from "./modules/requestPolicy.js";', 'import { fetchJsonWithPolicy, fetchResponseWithPolicy } from "./modules/requestPolicy.js";\nimport { nullableNumber, normalizeSymbolEvidence, explicitAction, validateSymbolDetail, createStore as createSymbolDetailStore } from "./modules/symbolDetailData.js";')
start=s.index('  function sfmFinalSafeNumber(value)');end=s.index('  function sfmFinalNormalizeCurrency',start)
s=s[:start]+'''  function sfmFinalSafeNumber(value) { return nullableNumber(value); }

'''+s[end:]
start=s.index('  function sfmFinalCleanSource(');end=s.index('  function sfmFinalPercentStyle',start)
s=s[:start]+'''  function sfmFinalCleanSource(value) {
    const raw = typeof value === "string" ? value.trim() : String(value?.provider || value?.active || "").trim();
    return raw || sfmFinalL("مصدر غير متاح", "Source unavailable");
  }

'''+s[end:]
start=s.index('  function sfmFinalNormalizeRecommendationAction');end=s.index('  function sfmFinalNormalizeRisk',start)
s=s[:start]+'''  function sfmFinalNormalizeRecommendationAction(item, _changePercent, hasCoreData) {
    const key = explicitAction(item, hasCoreData);
    const labels = { buy: sfmFinalL("شراء", "Buy"), sell: sfmFinalL("بيع", "Sell"), hold: sfmFinalL("انتظار", "Wait"), watch: sfmFinalL("مراقبة", "Watch"), pending: sfmFinalL("بانتظار الأدلة", "Awaiting evidence") };
    return { key, label: labels[key], className: `is-${key}` };
  }

'''+s[end:]
start=s.index('    const score = sfmFinalSafeNumber(item?.score ||');end=s.index('\n  function sfmFinalNormalizeRecommendationRows',start)
s=s[:start]+'''    // A directional analysis score is not a risk rating.
    return { label: sfmFinalRecommendationDash, className: "is-na" };
  }
'''+s[end:]
start=s.index('        const currentPrice = sfmFinalSafeNumber(item.currentPrice);',s.index('function sfmFinalNormalizeRecommendationRows'));end=s.index('\n        return {',start)
s=s[:start]+'''        const evidence = normalizeSymbolEvidence(item);
        const currentPrice = evidence.currentPrice;
        const expectedPrice = evidence.ready ? sfmFinalSafeNumber(item.expectedPrice) : null;
        const confidence = evidence.confidence;
        const percent = evidence.changePercent;
        const hasCorePrice = currentPrice !== null;
        const hasConfidence = confidence !== null;
        const hasCriticalPrice = evidence.ready;
        const action = sfmFinalNormalizeRecommendationAction(item, percent, hasCriticalPrice);
        const risk = evidence.ready ? sfmFinalNormalizeRisk(item) : { label: sfmFinalRecommendationDash, className: "is-na" };
'''+s[end:]
start=s.index('  function sfmFinalNormalizeRecommendationRows');a=s[:start];b=s[start:]
b=b.replace('expectedMovePct: percent,','changePercent: percent,')
b=b.replace('duration: sfmFinalSafeText(item.duration),','duration: evidence.ready ? sfmFinalSafeText(item.duration) : sfmFinalRecommendationDash,')
b=b.replace('target: sfmFinalSafeText(item.target1 || item.target || item.priceTarget),','target: evidence.target === null ? sfmFinalRecommendationDash : sfmFinalFormatPrice(evidence.target, item.currency),')
b=b.replace('score: sfmFinalSafeNumber(item.score),','score: evidence.ready ? sfmFinalSafeNumber(item.score) : null,')
b=b.replace('updatedAt: item.updatedAt || item.generatedAt || item.analyzedAt || "",','updatedAt: evidence.observedAt,')
b=b.replace('dataProvider: item.dataProvider || item.source || item.provider || item.priceSource,','dataProvider: evidence.source,')
b=b.replace('reasons: Array.isArray(item.reasons) ? item.reasons : [],','reasons: evidence.ready && Array.isArray(item.reasons) ? item.reasons : [],')
b=b.replace('decision: item.decision || null,','decision: evidence.ready ? item.decision || null : null,')
b=b.replace('aiScore: sfmFinalSafeNumber(item.score),','aiScore: evidence.ready ? sfmFinalSafeNumber(item.score) : null,')
b=b.replace('hasTarget: sfmFinalSafeNumber(item.target1) !== null || sfmFinalSafeNumber(item.target2) !== null,','hasTarget: evidence.target !== null,')
b=b.replace('explanation: item.decision?.message || item.decision?.title || item.decisionTitle || item.comment || ""','explanation: evidence.ready ? item.decision?.message || item.decision?.title || item.decisionTitle || item.comment || "" : sfmFinalL("الأدلة غير كافية لتوصية أو هدف موثوق. لا يتم تعويض البيانات الناقصة بقيم افتراضية.", "Evidence is insufficient for a supported recommendation or target. Missing data is not replaced with defaults.")')
b=b.replace('row.expectedMovePct','row.changePercent').replace('row.hasCorePrice && row.hasConfidence','row.hasCorePrice')
b=b.replace('dir="rtl"','dir="${sfmFinalIsEnglish() ? "ltr" : "rtl"}"')
b=b.replace('sfmFinalL("آخر تحديث", "Last update")','sfmFinalL("تحديث العرض", "View updated")')
b=b.replace('const explanation = sfmFinalSafeText(row.explanation)','const explanation = String(row.explanation || "").trim()')
b=b.replace('    sfmFinalOpenRecommendationDrawer();\n  }','''    sfmFinalDrawerContent.scrollTop = scrollTop;
    sfmFinalOpenRecommendationDrawer();
    sfmFinalUpdateDrawerStatus();
  }''',1)
b=b.replace('    if (!sfmFinalDrawer || !sfmFinalDrawerContent || !row) return;\n','    if (!sfmFinalDrawer || !sfmFinalDrawerContent || !row) return;\n    const scrollTop = sfmFinalDrawerContent.scrollTop;\n',1)
b=b.replace('sfmFinalL("آخر تحديث", "Last updated")','sfmFinalL("وقت بيانات المصدر", "Source observation time")')
b=b.replace('    sfmFinalDrawer.returnFocusTo = document.activeElement','    if (sfmFinalDrawer.classList.contains("is-open")) return;\n    sfmFinalDrawer.returnFocusTo = document.activeElement',1)
b=b.replace('    document.body.classList.add("recommendation-drawer-open");','''    document.body.classList.add("recommendation-drawer-open");
    sfmFinalBackground = Array.from(document.body.children).filter(element => element !== sfmFinalDrawer && element instanceof HTMLElement)
      .map(element => ({ element, inert: element.inert }));
    sfmFinalBackground.forEach(({ element }) => { element.inert = true; });''',1)
b=b.replace('    sfmFinalDrawer.classList.remove("is-open");','''    sfmFinalDetailStore.cancelPending();
    sfmFinalSelectedRow = null;
    sfmFinalBackground.forEach(({ element, inert }) => { element.inert = inert; });
    sfmFinalBackground = [];
    sfmFinalDrawer.classList.remove("is-open");''',1)
b=b.replace('    if (!sfmFinalDrawer) return;\n\n    sfmFinalDrawerButtons()','''    if (!sfmFinalDrawer) return;
    // Escape transformed/scrolling dashboard ancestors and isolate the modal.
    document.body.appendChild(sfmFinalDrawer);
    const panel = sfmFinalDrawer.querySelector(".recommendation-drawer-panel");
    const status = document.createElement("div");
    status.className = "symbol-detail-status";
    status.setAttribute("role", "status");
    status.innerHTML = '<span data-symbol-load-message></span>';
    panel.insertBefore(status, sfmFinalDrawerContent);
    const footer = document.createElement("footer");
    footer.className = "symbol-detail-actions";
    footer.innerHTML = `<button type="button" data-symbol-retry>${sfmFinalL("تحديث", "Refresh")}</button><a data-symbol-full>${sfmFinalL("التحليل الكامل", "Full analysis")}</a>`;
    panel.appendChild(footer);
    footer.querySelector("[data-symbol-retry]").addEventListener("click", () => sfmFinalLoadDrawerDetail(true));

    sfmFinalDrawerButtons()''',1)
b=b.replace('.filter((element) => !element.hidden && !element.hasAttribute("disabled"));','.filter((element) => element.getClientRects().length > 0 && !element.hasAttribute("disabled"));',1)
b=b.replace('        sfmFinalRenderRecommendationDetail(row);','''        sfmFinalDetailStore.cancelPending();
        sfmFinalSelectedRow = row;
        sfmFinalDrawerContent.scrollTop = 0;
        sfmFinalRenderRecommendationDetail(row);
        sfmFinalLoadDrawerDetail();''',1)
s=a+b
anchor='  let sfmFinalRecommendationsInited = false;'
s=s.replace(anchor,anchor+'''
  let sfmFinalSelectedRow = null;
  let sfmFinalBackground = [];
  const sfmFinalDetailStore = createSymbolDetailStore({ ttlMs: 120000, maxEntries: 24, onChange(key) {
    if (sfmFinalSelectedRow?.symbol !== key) return;
    const entry = sfmFinalDetailStore.read(key);
    if (entry.status === "success") {
      const row = sfmFinalNormalizeRecommendationRows([entry.value])[0];
      if (row) sfmFinalRenderRecommendationDetail(row);
    }
    sfmFinalUpdateDrawerStatus();
  } });

  function sfmFinalUpdateDrawerStatus() {
    if (!sfmFinalSelectedRow || !sfmFinalDrawer) return;
    const entry = sfmFinalDetailStore.read(sfmFinalSelectedRow.symbol);
    const loading = entry.status === "loading";
    const failed = entry.status === "error";
    const message = loading ? sfmFinalL("جاري جلب بيانات الرمز…", "Loading symbol data…")
      : failed ? sfmFinalL("تعذر تحديث بيانات الرمز. البيانات المعروضة لم تُحدّث؛ أعد المحاولة.", "Could not update symbol data. Displayed data was not refreshed; retry.")
        : sfmFinalL("راجع مصدر البيانات ووقتها أدناه؛ الأسعار قد تكون متأخرة.", "Check the data source and observation time below; prices may be delayed.");
    sfmFinalDrawer.querySelector("[data-symbol-load-message]").textContent = message;
    sfmFinalDrawerContent.setAttribute("aria-busy", String(loading));
    const retry = sfmFinalDrawer.querySelector("[data-symbol-retry]");
    retry.disabled = loading;
    retry.textContent = failed ? sfmFinalL("أعد المحاولة", "Retry") : sfmFinalL("تحديث", "Refresh");
    sfmFinalDrawer.querySelector("[data-symbol-full]").href = `/detail.html?symbol=${encodeURIComponent(sfmFinalSelectedRow.symbol)}`;
  }

  function sfmFinalLoadDrawerDetail(force = false) {
    const symbol = sfmFinalSelectedRow?.symbol;
    if (!symbol) return;
    sfmFinalDetailStore.load(symbol, async signal => {
      const payload = await fetchJsonWithPolicy(`/api/asset?symbol=${encodeURIComponent(symbol)}`, { signal, timeoutMs: 20000, retries: 1 });
      return validateSymbolDetail(payload, symbol);
    }, { force }).then(entry => {
      // A cached successful request needs rendering too. Never reopen a closed or switched drawer.
      if (sfmFinalSelectedRow?.symbol !== symbol || entry.status !== "success") return;
      const row = sfmFinalNormalizeRecommendationRows([entry.value])[0];
      if (row) sfmFinalRenderRecommendationDetail(row);
    });
    sfmFinalUpdateDrawerStatus();
  }
''')
s=s.replace('sfmFinalIsEnglish() ? "en-US" : "ar-KW"','sfmFinalIsEnglish() ? "en-US" : "ar-KW-u-nu-latn"')
p.write_text('\ufeff'+s)
p=root/'src/marketDataProvenance.mjs'
p.write_text(p.read_text()+'''
// Percent change against the provider's previous close, not an analyst price target.
export function observedDailyChangePercent(meta = {}, currentPrice) {
  const finite = value => (typeof value === "number" || (typeof value === "string" && value.trim())) && Number.isFinite(Number(value)) ? Number(value) : null;
  const explicit = finite(meta.regularMarketChangePercent);
  if (explicit !== null) return explicit;
  const previous = finite(meta.chartPreviousClose ?? meta.previousClose);
  const current = finite(currentPrice);
  return previous !== null && previous > 0 && current !== null && current > 0 ? (current - previous) / previous * 100 : null;
}
''')
p=root/'src/analysis.mjs';s=p.read_text().replace('import { buildMarketDataProvenance }','import { buildMarketDataProvenance, observedDailyChangePercent }').replace('    expectedMovePct: pctChange(currentPrice, expectedPrice),','    expectedMovePct: pctChange(currentPrice, expectedPrice),\n    changePercent: observedDailyChangePercent(meta, currentPrice),',1);p.write_text(s)
p=root/'public/index.html';s=p.read_text().replace('</head>','  <link rel="stylesheet" href="/symbol-detail-mobile.css?v=20260916-symbol-data" />\n  </head>',1).replace('app.js?v=20260802-terminal-home-v3-visual-fix','app.js?v=20260916-symbol-data');p.write_text(s)
p=root/'public/service-worker.js';s=p.read_text().replace('the-sfm-trader-v20260802-terminal-home-v3-visual-fix','the-sfm-trader-v20260916-symbol-data').replace('/app.js?v=20260802-terminal-home-v3-visual-fix','/app.js?v=20260916-symbol-data').replace('  "/modules/requestPolicy.js",','  "/modules/requestPolicy.js",\n  "/modules/symbolDetailData.js",\n  "/symbol-detail-mobile.css?v=20260916-symbol-data",');p.write_text(s)
p=root/'tools/check.mjs';s=p.read_text().replace('  "public/modules/requestPolicy.js",','  "public/modules/requestPolicy.js",\n  "public/modules/symbolDetailData.js",');p.write_text(s)
