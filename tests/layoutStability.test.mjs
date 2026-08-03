import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readHomeFiles = async () => Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/dashboard-v2.css", import.meta.url), "utf8"),
  readFile(new URL("../public/service-worker.js", import.meta.url), "utf8")
]);

test("Home V3 is the final authoritative presentation layer", async () => {
  const [html, , css] = await readHomeFiles();
  const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((match) => match[1]);
  const v3Index = styles.findIndex((value) => value.includes("dashboard-v2.css"));

  assert.ok(v3Index > styles.findIndex((value) => value.includes("layout-stability.css")));
  assert.equal(v3Index, styles.length - 1);
  assert.match(css, /Authoritative SFM Trader Home V3 presentation layer/);
  assert.match(css, /--v3-page: #06111f/);
  assert.match(css, /--v3-teal: #2fd6c0/);
  assert.match(css, /grid-template-areas:\s*"topbar rail"/);
  assert.match(css, /--stable-rail: 108px/);
});

test("Home V3 hierarchy keeps the RTL reading copy with a physical left confidence ring", async () => {
  const [html, app, css] = await readHomeFiles();

  for (const id of ["terminal-home-v3", "v3-confidence-ring", "v3-opportunity-grid", "v3-heatmap-grid", "v3-followed-list", "v3-calendar-list"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /SFM Trader/);
  assert.match(html, /AI Market Analysis/);
  assert.match(css, /\.v3-reading-body\s*\{[\s\S]*direction: ltr/);
  assert.match(css, /\.v3-reading-copy\s*\{\s*direction: rtl/);
  assert.match(css, /grid-template-areas: "reading pulse"/);
  assert.match(app, /confidenceRing\.style\.setProperty\("--v3-confidence"/);
  assert.doesNotMatch(app, /v3-confidence[^\n]{0,100}62%/);
});

test("central local company-mark registry supplies every required Home V3 brand", async () => {
  const [, app, css] = await readHomeFiles();

  assert.match(app, /const ASSET_BRAND_REGISTRY = Object\.freeze/);
  assert.match(app, /function renderAssetLogo\(/);
  assert.match(app, /function getOfficialCompanyName\(/);
  for (const symbol of ["META", "GOOGL", "GOOG", "MSFT", "AAPL", "NVDA", "AMZN", "TSLA", "NFLX", "INTC", "AMD", "ORCL", "AVGO", "LLY", "GOLD", "XAUUSD"]) {
    assert.match(app, new RegExp(`${symbol}:`));
  }
  assert.match(app, /Meta Platforms/);
  assert.match(app, /Alphabet Inc\./);
  assert.match(app, /Microsoft Corp\./);
  assert.match(app, /renderAssetLogo\(item, \{ className: "v3-heat-logo" \}\)/);
  assert.match(css, /asset-logo-broadcom/);
  assert.match(css, /asset-logo-wordmark-lilly/);
  assert.doesNotMatch(app, /emoji as company logos/i);
});

test("Home V3 charts, followed trades, and calendar remain truthful", async () => {
  const [, app, css] = await readHomeFiles();
  const pulseRenderer = app.match(/function renderV3PulseChart\([\s\S]*?function renderV3FollowedTrade\(/)?.[0] || "";

  assert.match(pulseRenderer, /class="v3-pulse-grid"/);
  assert.match(pulseRenderer, /<polygon points="\$\{areaPoints\}">/);
  assert.doesNotMatch(pulseRenderer, /09:30|11:30|13:30|15:30/);
  assert.match(app, /followed\.map\(renderV3FollowedTrade\)/);
  assert.match(app, /renderV3EmptyState\("لا توجد صفقات محفوظة تحت المتابعة\."/);
  assert.doesNotMatch(app, /const fallback = ranked\.slice\(0, 3\)/);
  assert.match(app, /entryPrice \?\? entry\.currentPrice/);
  assert.match(app, /entry\.target1 \?\? entry\.expectedPrice/);
  assert.match(app, /const date = event\.date/);
  assert.match(css, /\.v3-calendar-event\.high/);
  assert.match(css, /\.v3-heatmap-grid \{ display: grid; grid-template-columns: repeat\(8/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.v3-heatmap-grid \{ grid-template-columns: repeat\(2/);
});

test("offline shell versions stay aligned with the Home V3 entry files", async () => {
  const [html, , , worker] = await readHomeFiles();
  const homeScript = html.match(/<script src="([^"]*app\.js[^"]*)"/)?.[1];
  const homeStylesheet = html.match(/<link rel="stylesheet" href="([^"]*dashboard-v2\.css[^"]*)"/)?.[1];

  assert.ok(homeScript);
  assert.ok(homeStylesheet);
  assert.ok(worker.includes(`"${homeScript}"`));
  assert.ok(worker.includes(`"${homeStylesheet}"`));
  assert.match(worker, /the-sfm-trader-v20260804-home-v3-premium-parity-9/);
});
