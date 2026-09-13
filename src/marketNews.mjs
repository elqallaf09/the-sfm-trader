// Headlines link to the publisher; article bodies and invented publication times are never stored.
const PUBLIC_FEEDS = [
  { source: "Federal Reserve", url: "https://www.federalreserve.gov/feeds/press_all.xml" },
  { source: "European Central Bank", url: "https://www.ecb.europa.eu/rss/press.html" }
];

function decodeText(value) {
  return String(value || "").trim().replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "")
    .replace(/<[^>]*>/g, "").replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => {
      const number = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code);
      return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : "";
    }).replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"').replaceAll("&apos;", "'").trim();
}

function httpUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
  } catch { return ""; }
}

export function normalizeNewsItems(items, now = Date.now()) {
  const seen = new Set();
  return items.filter(item => item && typeof item === "object").map(item => {
    const url = httpUrl(item.url);
    const timestamp = Date.parse(item.publishedAt || "");
    const title = decodeText(item.title).slice(0, 400);
    const source = decodeText(item.source).slice(0, 100);
    if (!url || !title || !source || !Number.isFinite(timestamp) || timestamp > now + 300_000 || timestamp < now - 30 * 86400_000) return null;
    if (seen.has(url)) return null;
    seen.add(url);
    return { title, source, url, publishedAt: new Date(timestamp).toISOString() };
  }).filter(Boolean).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 24);
}

export function parseNewsRss(xml, source) {
  const field = (block, name) => {
    const match = block.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + name + ">", "i"));
    return decodeText(match?.[1] || "");
  };
  if (!/<(?:rss|rdf:RDF)\b/i.test(xml)) throw new Error("Invalid news feed");
  return [...String(xml).matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map(match => ({
    title: field(match[1], "title"), source,
    url: field(match[1], "link"),
    publishedAt: field(match[1], "pubDate") || field(match[1], "dc:date")
  }));
}

async function readFeed(fetchImpl, url, { headers = {}, timeoutMs = 5000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const limit = 2_000_000;
  try {
    const response = await fetchImpl(url, { signal: controller.signal, headers: { "user-agent": "the-sfm-trader/1.0 market-news", ...headers } });
    if (!response.ok) throw new Error("News provider HTTP " + response.status);
    if (Number(response.headers.get("content-length")) > limit) throw new Error("News feed too large");
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Empty news response");
    const chunks = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error("News feed too large"); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return new TextDecoder().decode(bytes);
  } finally { clearTimeout(timer); }
}

export function createMarketNewsService({ fetchImpl = fetch, now = Date.now, apiKey = process.env.FINNHUB_API_KEY || "", timeoutMs = 5000 } = {}) {
  let cache = null; let inflight = null; let retryAt = 0;
  return async function getMarketNews() {
    if (cache && now() < retryAt) return cache;
    if (inflight) return inflight;
    inflight = (async () => {
      const requests = PUBLIC_FEEDS.map(async feed => parseNewsRss(await readFeed(fetchImpl, feed.url, { timeoutMs }), feed.source));
      if (apiKey) requests.unshift((async () => {
        const data = JSON.parse(await readFeed(fetchImpl, "https://finnhub.io/api/v1/news?category=general", { headers: { "X-Finnhub-Token": apiKey }, timeoutMs }));
        if (!Array.isArray(data)) throw new Error("Invalid news payload");
        return data.filter(item => item && typeof item === "object").map(item => ({
          title: item.headline, source: item.source, url: item.url,
          publishedAt: Number.isFinite(item.datetime) ? new Date(item.datetime * 1000).toISOString() : ""
        }));
      })());
      const results = await Promise.allSettled(requests);
      const successful = results.filter(result => result.status === "fulfilled");
      const articles = normalizeNewsItems(successful.flatMap(result => result.value), now());
      const failed = results.length - successful.length;
      const oldArticles = normalizeNewsItems(cache?.articles || [], now());
      const timestamp = new Date(now()).toISOString();
      cache = articles.length ? {
        articles, dataState: "fresh", fetchedAt: timestamp, partial: failed > 0
      } : failed ? {
        articles: oldArticles, dataState: oldArticles.length ? "stale" : "unavailable", fetchedAt: cache?.fetchedAt || null, partial: true
      } : {
        articles: [], dataState: "empty", fetchedAt: timestamp, partial: false
      };
      retryAt = now() + (failed ? 60_000 : 10 * 60_000);
      return cache;
    })().finally(() => { inflight = null; });
    return inflight;
  };
}
