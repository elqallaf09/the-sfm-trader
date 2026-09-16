import assert from "node:assert/strict";
import test from "node:test";
import { createMarketFeeds, renderNewsFeed, renderCalendarFeed } from "../public/modules/marketFeeds.js";
import { normalizeNewsItems, parseNewsRss, createMarketNewsService } from "../src/marketNews.mjs";

test("calendar and headlines load separately and old-market responses are ignored", async () => {
  let market = "us";
  const pending = [];
  const feeds = createMarketFeeds({
    getMarket: () => market, onChange() {},
    request: url => new Promise(resolve => pending.push({ url, resolve }))
  });
  const first = feeds.load();
  await Promise.resolve();
  pending.find(item => item.url.includes("economic-calendar")).resolve({ marketId: "us", dataState: "fresh", upcoming: [{ title: "US" }] });
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(feeds.snapshot().calendar.marketId, "us");
  market = "forex";
  const second = feeds.load();
  await Promise.resolve();
  const calendarRequests = pending.filter(item => item.url.includes("economic-calendar"));
  calendarRequests.at(-1).resolve({ marketId: "forex", dataState: "fresh", upcoming: [] });
  const newsRequests = pending.filter(item => item.url.includes("market-news"));
  newsRequests.at(-1).resolve({ dataState: "fresh", articles: [] });
  await second;
  newsRequests[0].resolve({ dataState: "fresh", articles: [{ title: "Old response" }] });
  await first;
  assert.equal(feeds.snapshot().calendar.marketId, "forex");
  assert.deepEqual(feeds.snapshot().news.articles, []);
});

test("news requires a publisher, safe link and genuine date", () => {
  const now = Date.parse("2026-09-14T12:00:00Z");
  const rss = '<rss><channel><item><title><![CDATA[Test &amp; headline]]></title><link>https://example.test/news</link><pubDate>Mon, 14 Sep 2026 10:00:00 GMT</pubDate></item></channel></rss>';
  const items = normalizeNewsItems(parseNewsRss(rss, "Test provider"), now);
  assert.equal(items.length, 1);
  assert.equal(items[0].title, "Test & headline");
  assert.equal(normalizeNewsItems([{ ...items[0], url: "javascript:alert(1)" }], now).length, 0);
  assert.equal(normalizeNewsItems([{ ...items[0], publishedAt: "" }], now).length, 0);
  const html = renderNewsFeed({ articles: [{ ...items[0], title: '<img onerror="alert(1)">' }], dataState: "fresh" }).html;
  assert.ok(!html.includes("<img"));
  assert.match(html, /noopener noreferrer/);
});

test("news service shares requests and returns unavailable on total failure", async () => {
  let requests = 0;
  const getNews = createMarketNewsService({ apiKey: "", fetchImpl: async () => { requests++; throw new Error("offline"); } });
  const [first, second] = await Promise.all([getNews(), getNews()]);
  assert.equal(requests, 2);
  assert.equal(first, second);
  assert.equal(first.dataState, "unavailable");
  assert.deepEqual(first.articles, []);
});

test("calendar failure is explicit and missing actual results are not invented", () => {
  assert.equal(renderCalendarFeed({ dataState: "unavailable" }).state, "unavailable");
  assert.match(renderCalendarFeed({ dataState: "unavailable" }).html, /data-feed-refresh/);
  const html = renderCalendarFeed({ dataState: "fresh", upcoming: [{ title: "Event", isoTime: "2026-09-16T12:00:00Z", currency: "USD", forecast: "2%", previous: "1%", actual: "" }] }).html;
  assert.match(html, /2%/);
  assert.match(html, /غير متاح/);
});
