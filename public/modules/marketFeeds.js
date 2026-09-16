import { escapeHtml, safeHttpUrl } from "./html.js?v=20260914-audit-repair-1";

export function createMarketFeeds({ request, getMarket, onChange, now = Date.now }) {
  let activeRequest = null;
  let calendar = { dataState: "loading" };
  let calendarMarket = "";
  let news = { dataState: "loading", articles: [] };
  let loadedAt = 0;
  let refreshAfterMs = 5 * 60_000;
  let generation = 0;
  const snapshot = () => ({ calendar: calendarMarket === getMarket() ? calendar : { dataState: "loading" }, news });

  function load({ force = false } = {}) {
    const market = getMarket();
    if (activeRequest?.market === market) return activeRequest.promise;
    if (!force && calendarMarket === market && loadedAt && now() - loadedAt < refreshAfterMs) return Promise.resolve(snapshot());
    const id = ++generation;
    if (calendarMarket !== market) {
      calendar = { dataState: "loading" };
      calendarMarket = market;
      onChange(snapshot());
    }
    const current = () => id === generation && market === getMarket();
    const calendarTask = Promise.resolve().then(() => request("/api/economic-calendar?market=" + encodeURIComponent(market), { retries: 0, timeoutMs: 12000 }))
      .then(value => { if (current()) { calendar = value; onChange(snapshot()); } })
      .catch(() => { if (current()) { calendar = { ...calendar, dataState: calendar.upcoming?.length || calendar.recent?.length ? "stale" : "unavailable" }; onChange(snapshot()); } });
    const newsTask = Promise.resolve().then(() => request("/api/market-news", { retries: 0, timeoutMs: 12000 }))
      .then(value => { if (current()) { news = value; onChange(snapshot()); } })
      .catch(() => { if (current()) { news = { ...news, dataState: news.articles?.length ? "stale" : "unavailable" }; onChange(snapshot()); } });
    const promise = Promise.allSettled([calendarTask, newsTask]).then(() => {
      if (current()) {
        loadedAt = now();
        const healthy = value => ["fresh", "empty"].includes(value?.dataState) && !value.partial;
        refreshAfterMs = healthy(calendar) && healthy(news) ? 5 * 60_000 : 30_000;
      }
      return snapshot();
    }).finally(() => { if (id === generation) activeRequest = null; });
    activeRequest = { market, promise };
    return promise;
  }
  return { load, snapshot };
}

export function renderNewsFeed(payload = {}, { english = false, formatDateTime = String, compact = false } = {}) {
  const articles = (Array.isArray(payload.articles) ? payload.articles : [])
    .filter(item => item?.title && safeHttpUrl(item.url) && Number.isFinite(Date.parse(item.publishedAt)));
  const state = payload.dataState || (articles.length ? "fresh" : "loading");
  const status = feedStatus(state, english);
  const note = payload.fetchedAt ? (english ? "Updated: " : "آخر تحديث: ") + formatDateTime(payload.fetchedAt) : "";
  const html = articles.length ? articles.slice(0, compact ? 4 : 24).map(item => `<article class="market-feed-card">
    <a class="market-feed-title" href="${escapeHtml(safeHttpUrl(item.url))}" target="_blank" rel="noopener noreferrer" dir="auto">${escapeHtml(item.title)}</a>
    <div class="market-feed-meta"><span>${escapeHtml(item.source)}</span><time datetime="${escapeHtml(item.publishedAt)}">${escapeHtml(formatDateTime(item.publishedAt))}</time></div>
  </article>`).join("") : renderFeedEmpty(state, english, "news");
  return { status, note, html, state };
}

export function renderCalendarFeed(payload = {}, { english = false, formatDateTime = String } = {}) {
  const events = [...(payload.hotEvents || []), ...(payload.upcoming || []), ...(payload.recent || [])]
    .filter(event => event?.title && Number.isFinite(Date.parse(event.isoTime)))
    .filter((event, index, all) => all.findIndex(other => other.title === event.title && other.currency === event.currency && other.isoTime === event.isoTime) === index);
  const state = payload.dataState || (events.length ? "fresh" : "loading");
  const status = feedStatus(state, english);
  const note = [payload.source, payload.fetchedAt ? (english ? "Updated: " : "آخر تحديث: ") + formatDateTime(payload.fetchedAt) : ""].filter(Boolean).join(" · ");
  const html = events.length ? events.map(event => {
    const impact = ["high", "medium", "low"].includes(event.impact) ? event.impact : "low";
    const impactLabel = english ? { high: "High", medium: "Medium", low: "Low" }[impact] : { high: "عالي", medium: "متوسط", low: "منخفض" }[impact];
    const occurred = Date.parse(event.isoTime) < Date.now();
    const timing = event.exactTime === false ? (english ? "Time to be confirmed" : "موعد غير محدد") : formatDateTime(event.isoTime);
    const url = safeHttpUrl(event.url);
    const title = url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" dir="auto">${escapeHtml(event.title)}</a>` : escapeHtml(event.title);
    const unavailable = english ? "Unavailable" : "غير متاح";
    return `<article class="market-feed-card calendar-feed-card">
      <div class="market-feed-meta"><span>${escapeHtml(event.currency)}</span><b class="feed-impact is-${impact}">${impactLabel}</b></div>
      <h3 class="market-feed-title" dir="auto">${title}</h3>
      <time datetime="${escapeHtml(event.isoTime)}">${escapeHtml(timing)} · ${occurred ? (english ? "Recent" : "حدث سابق") : (english ? "Upcoming" : "قادم")}</time>
      <dl class="calendar-feed-values">
        <div><dt>${english ? "Forecast" : "المتوقع"}</dt><dd dir="auto">${escapeHtml(event.forecast === "" || event.forecast == null ? unavailable : event.forecast)}</dd></div>
        <div><dt>${english ? "Previous" : "السابق"}</dt><dd dir="auto">${escapeHtml(event.previous === "" || event.previous == null ? unavailable : event.previous)}</dd></div>
        <div><dt>${english ? "Actual" : "الفعلي"}</dt><dd dir="auto">${escapeHtml(event.actual === "" || event.actual == null ? unavailable : event.actual)}</dd></div>
      </dl>
    </article>`;
  }).join("") : renderFeedEmpty(state, english, "calendar");
  return { status, note, html, state };
}

function feedStatus(state, english) {
  return (english ? { loading: "Loading", fresh: "Updated", stale: "Saved data · update unavailable", unavailable: "Provider unavailable", empty: "No recent items" } : { loading: "جارٍ التحميل", fresh: "محدّث", stale: "بيانات محفوظة · تعذر التحديث", unavailable: "تعذر الاتصال بالمصدر", empty: "لا توجد عناصر حديثة" })[state] || (english ? "Unavailable" : "غير متاح");
}

function renderFeedEmpty(state, english, type) {
  const text = state === "loading" ? (english ? "Loading from the source…" : "جارٍ تحميل البيانات من المصدر…")
    : state === "unavailable" ? (english ? "The provider could not be reached. Try again." : "تعذر الاتصال بالمصدر. أعد المحاولة.")
    : type === "calendar" ? (english ? "No events for this market in the available week." : "لا توجد أحداث لهذا السوق ضمن الأسبوع المتاح.")
    : (english ? "No dated news was returned by the sources." : "لم ترجع المصادر أخباراً مؤرخة لعرضها.");
  return `<div class="market-feed-empty" role="status"><p>${text}</p>${state === "unavailable" ? `<button type="button" data-feed-refresh>${english ? "Retry" : "إعادة المحاولة"}</button>` : ""}</div>`;
}
