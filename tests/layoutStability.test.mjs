import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("dashboard loads one final authoritative layout after legacy theme sheets", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((match) => match[1]);
  const stableIndex = styles.findIndex((value) => value.includes("layout-stability.css"));
  const redesignIndex = styles.findIndex((value) => value.includes("dashboard-v2.css"));
  assert.ok(stableIndex > styles.findIndex((value) => value.includes("cinema.css")));
  assert.ok(stableIndex > styles.findIndex((value) => value.includes("styles.css")));
  assert.ok(redesignIndex > stableIndex);
});

test("desktop dashboard keeps rail, main, summary and footer in named grid areas", async () => {
  const css = await readFile(new URL("../public/layout-stability.css", import.meta.url), "utf8");
  assert.match(css, /"rail main right"/);
  assert.match(css, /grid-area: rail !important/);
  assert.match(css, /grid-area: main !important/);
  assert.match(css, /grid-area: right !important/);
  assert.match(css, /grid-area: footer !important/);
  assert.match(css, /grid-template-rows: auto 0 minmax\(0, auto\) auto !important/);
  assert.match(css, /flex: 0 0 var\(--stable-rail\) !important/);
  assert.match(css, /position: absolute !important/);
  assert.match(css, /@media \(min-width: 1024px\) and \(max-width: 1439px\)/);
  assert.match(css, /"rail main"\s*\n\s*"rail right"/);
  assert.match(css, /@media \(max-width: 1023px\)/);
  assert.match(css, /\.site-footer \{\s*display: flex !important/);
  assert.match(css, /padding-bottom: 12px !important/);
});

test("offline shell includes the authoritative layout stylesheet", async () => {
  const worker = await readFile(new URL("../public/service-worker.js", import.meta.url), "utf8");
  assert.match(worker, /layout-stability\.css\?v=20260802-dashboard-data-ux-4/);
  assert.match(worker, /dashboard-v2\.css\?v=20260802-terminal-redesign/);
});

test("terminal redesign prioritizes readable summaries over dense home tables", async () => {
  const css = await readFile(new URL("../public/dashboard-v2.css", import.meta.url), "utf8");
  assert.match(css, /--stable-aside: clamp\(310px, 19vw, 350px\) !important/);
  assert.match(css, /\.rdp-pick-row \{[\s\S]*grid-template-areas: "asset signal" "time confidence" !important/);
  assert.match(css, /\.home-heat-cell:nth-child\(n \+ 9\)/);
  assert.match(css, /\.economic-news-card:nth-child\(n \+ 4\)/);
  assert.match(css, /\.market-band \{ display: none !important; \}/);
  assert.match(css, /@media \(min-width: 1024px\) and \(max-width: 1180px\)/);
  assert.match(css, /section#home-heatmap-section#home-heatmap-section#home-heatmap-section\.home-heatmap-section/);
  assert.match(css, /section#home-deck-section#home-deck-section#home-deck-section\.home-deck-section \.home-deck-panel:last-child/);
  assert.match(css, /@media \(max-width: 1023px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("home dashboard remains compact while recommendation details stay in their own view", async () => {
  const [app, css] = await Promise.all([
    readFile(new URL("../public/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/layout-stability.css", import.meta.url), "utf8")
  ]);
  const homeGroup = app.match(/home:\s*\[([^\]]+)\]/)?.[1] || "";
  const recommendationsGroup = app.match(/recommendations:\s*\[([^\]]+)\]/)?.[1] || "";

  assert.doesNotMatch(homeGroup, /#recommendations-section/);
  assert.match(recommendationsGroup, /#recommendations-section/);
  assert.match(css, /body\[data-app-view="home"\] #recommendations-section/);
  assert.match(css, /section#recommendations-section#recommendations-section#recommendations-section/);
  assert.match(css, /section#home-heatmap-section#home-heatmap-section#home-heatmap-section/);
  assert.match(css, /\.sidebar-brand-block \{\s*display: grid !important/);
  assert.match(css, /#home-deck-section\.home-deck-section \.home-deck-panel:last-child/);
  assert.match(css, /\.home-followed-trades \{\s*min-height: 84px !important/);
  assert.match(css, /\.home-rec-card,[\s\S]*\.home-heat-cell \{[\s\S]*opacity: 1 !important/);
});

test("home panels use unfiltered market data and tolerate incomplete scoring fields", async () => {
  const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /function getDashboardRecommendations\(/);
  assert.match(app, /function getDashboardScore\(/);
  assert.match(app, /return clamp\(Number\(item\?\.confidence \|\| 0\), 0, 100\)/);
  assert.match(app, /const available = getDashboardRecommendations\(data\)/);
  assert.match(app, /const visiblePicks = picks\.length/);
  assert.match(app, /const sfmFinalDashboardRenderer = renderRecommendations/);
  assert.match(app, /sfmFinalDashboardRenderer\(data\);\s*sfmFinalRenderRecommendations\(data\);/);
  assert.match(app, /function setHomeDashboardState\(/);
  assert.match(app, /setHomeDashboardState\("loading"\)/);
  assert.match(app, /setHomeDashboardState\("offline"\)/);
  assert.match(app, /No market values are shown until a trusted provider responds/);
});
