import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readPngSize = (buffer) => ({
  width: buffer.readUInt32BE(16),
  height: buffer.readUInt32BE(20)
});

const readHomeFiles = async () => Promise.all([
  readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  readFile(new URL("../public/app.js", import.meta.url), "utf8"),
  readFile(new URL("../public/dashboard-v2.css", import.meta.url), "utf8"),
  readFile(new URL("../public/service-worker.js", import.meta.url), "utf8"),
  readFile(new URL("../public/layout-stability.css", import.meta.url), "utf8")
]);

test("Home V3 is the final authoritative presentation layer", async () => {
  const [html, , css, , layoutStability] = await readHomeFiles();
  const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((match) => match[1]);
  const v3Index = styles.findIndex((value) => value.includes("dashboard-v2.css"));

  assert.ok(v3Index > styles.findIndex((value) => value.includes("layout-stability.css")));
  assert.equal(v3Index, styles.length - 1);
  assert.match(css, /Authoritative SFM Trader Home V3 presentation layer/);
  assert.match(css, /--v3-page: #06111f/);
  assert.match(css, /--v3-teal: #2fd6c0/);
  assert.match(css, /grid-template-areas:\s*"topbar rail"/);
  assert.match(css, /--stable-rail: 108px/);
  assert.match(css, /min-width: var\(--stable-rail\) !important/);
  assert.match(css, /max-width: var\(--stable-rail\) !important/);
  assert.match(css, /min-height: 0 !important/);
  assert.match(css, /grid-template-rows: auto 0 auto auto !important/);
  assert.match(css, /body\[data-app-view="home"\] \.app-shell\.sfm-dashboard > \.site-footer[\s\S]*width: 100% !important/);
  assert.match(html, /<body class="notranslate" data-app-view="home"/);
  assert.match(layoutStability, /Legacy application-shell geometry for non-Home views only/);
  assert.doesNotMatch(layoutStability, /body\[data-app-view\] \.app-shell\.sfm-dashboard/);
});

test("Home view router excludes legacy shell chrome and old Home sections", async () => {
  const [html, app] = await readHomeFiles();
  const homeGroup = app.match(/home:\s*\[([^\]]+)\]/)?.[1] || "";

  assert.match(html, /class="right-dashboard-panel"[^>]*data-app-view-shell="legacy-summary"[^>]*hidden/);
  assert.match(app, /function syncAppViewShell\(view\)/);
  assert.match(app, /syncAppViewShell\(nextView\)/);
  assert.match(app, /element\.hidden = !visible/);
  assert.match(homeGroup, /#terminal-home-v3/);
  assert.match(homeGroup, /#temporary-legal-notices/);
  assert.doesNotMatch(homeGroup, /recommendations-section|home-deck-section|markets-section|economic-news-section/);
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

test("Home V3 header cannot inherit the legacy gold brand treatment", async () => {
  const [, , css] = await readHomeFiles();
  const headerRule = css.match(/body\[data-app-view="home"\] \.brand-lockup h1 \{([\s\S]*?)\n\}/)?.[1] || "";

  assert.match(headerRule, /-webkit-text-fill-color: #ffffff !important/);
  assert.match(headerRule, /color: #ffffff !important/);
  assert.match(headerRule, /text-shadow: none !important/);
  assert.doesNotMatch(headerRule, /gold|#d8ac50|#d7b76c/i);
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

test("Home V3 starts with explicit loading and unavailable panel states", async () => {
  const [html, app, css] = await readHomeFiles();

  assert.match(html, /id="terminal-home-v3"[^>]*aria-busy="true"[^>]*data-ui-state="loading"/);
  assert.match(html, /class="v3-panel-state" data-ui-state="loading" role="status"/);
  assert.match(app, /function setTerminalHomeV3State\(kind = "loading"\)/);
  assert.match(app, /const state = unavailable \? "unavailable" : "loading"/);
  assert.match(app, /لا توجد قيم بديلة معروضة/);
  assert.match(app, /root\.dataset\.uiState = state/);
  assert.match(app, /data\.cached \|\| data\.stale \? "stale" : "fresh"/);
  assert.match(css, /\.v3-panel-state\[data-ui-state="unavailable"\]/);
});

test("offline shell versions stay aligned with the Home V3 entry files", async () => {
  const [html, , , worker] = await readHomeFiles();
  const homeScript = html.match(/<script src="([^"]*app\.js[^"]*)"/)?.[1];
  const homeStylesheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((href) => href.startsWith("/"));

  assert.ok(homeScript);
  assert.ok(worker.includes(`"${homeScript}"`));
  for (const stylesheet of homeStylesheets) assert.ok(worker.includes(`"${stylesheet}"`));
  assert.match(worker, /the-sfm-trader-v20260804-home-v3-layout-fix-3/);
});

test("Home V3 visual evidence is captured as exact viewport screenshots", async () => {
  const manifest = JSON.parse(await readFile(new URL("../docs/visual-verification/home-v3-fixed-capture-manifest.json", import.meta.url), "utf8"));

  assert.equal(manifest.captureMode, "viewport");
  assert.equal(manifest.fullPage, false);
  assert.deepEqual(manifest.captures.map(({ file, viewport }) => ({ file, viewport })), [
    { file: "home-v3-fixed-1680x945.png", viewport: { width: 1680, height: 945 } },
    { file: "home-v3-fixed-1440x900.png", viewport: { width: 1440, height: 900 } },
    { file: "home-v3-fixed-mobile-390x844.png", viewport: { width: 390, height: 844 } }
  ]);

  for (const capture of manifest.captures) {
    const image = await readFile(new URL(`../docs/visual-verification/${capture.file}`, import.meta.url));
    assert.deepEqual(readPngSize(image), capture.viewport, capture.file);
  }
});
