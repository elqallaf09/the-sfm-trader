import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import axe from "axe-core";
import path from "node:path";
import { chromium } from "playwright";
import { fixture } from "./fixtures/home-v3.mjs";

const baseUrl = process.env.VISUAL_BASE_URL || "http://127.0.0.1:4173";
const outputDirectory = path.resolve(process.env.VISUAL_OUTPUT_DIR || ".artifacts/home-v3");
const captures = [
  { file: "home-v3-final-corrected-1680x945.png", viewport: { width: 1680, height: 945 } },
  { file: "home-v3-final-corrected-1440x900.png", viewport: { width: 1440, height: 900 } },
  { file: "home-v3-final-corrected-mobile-390x844.png", viewport: { width: 390, height: 844 } }
];
await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const measurements = [];
const checks = [];
const consoleErrors = [];
const verificationFailures = [];
function recordVerification(label, check) {
  try { check(); } catch (error) {
    verificationFailures.push({ label, message: error.message });
    console.error("Verification assertion:", label, error.message);
  }
}
let activePage;
let activeCase = "startup";

async function openPage(viewport, initialMode = "fresh", initialFeedMode = "fresh") {
  const context = await browser.newContext({ viewport, serviceWorkers: "block", reducedMotion: "reduce" });
  const page = await context.newPage();
  activePage = page;
  const state = { mode: initialMode, feedsMode: initialFeedMode, requests: 0, notifications: [] };
  page.on("console", message => {
    if (message.type() !== "error") return;
    // Expected HTTP failures are asserted by the provider-unavailable scenarios.
    if ((state.mode === "unavailable" || state.feedsMode === "unavailable") && /Failed to load resource:.*503/.test(message.text())) return;
    consoleErrors.push(message.text());
  });
  page.on("pageerror", error => consoleErrors.push(error.stack || error.message));
  await page.route("**/api/**", async route => {
    const url = new URL(route.request().url());
    const respond = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname === "/api/recommendations") {
      state.requests++;
      if (state.mode === "loading") {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
      if (state.mode === "unavailable") return respond({ error: "Test provider unavailable" }, 503);
      if (state.mode === "empty") return respond({ recommendations: [], market: { id: "us", label: "US Market" } });
      if (state.mode === "missing") {
        const data = structuredClone(fixture);
        delete data.generatedAt;
        delete data.unavailable;
        delete data.market.note;
        for (const item of data.recommendations) delete item.reasons;
        return respond(data);
      }
      return respond(fixture);
    }
    if (url.pathname === "/api/economic-calendar") {
      if (state.feedsMode === "unavailable") return respond({ error: "Test calendar unavailable" }, 503);
      return respond({ dataState: "fresh", fetchedAt: new Date().toISOString(), source: "Test calendar",
        upcoming: [{ title: "Test economic event", currency: "USD", impact: "high",
          isoTime: new Date(Date.now() + 3600000).toISOString(), forecast: "2%", previous: "1%", actual: "" }] });
    }
    if (url.pathname === "/api/market-news") {
      if (state.feedsMode === "unavailable") return respond({ error: "Test news unavailable" }, 503);
      return respond({ dataState: "fresh", fetchedAt: new Date().toISOString(),
        articles: [{ title: "Test market headline", source: "Test publisher",
          url: "https://example.test/news", publishedAt: new Date().toISOString() }] });
    }
    if (url.pathname === "/api/asset") return respond({
      recommendation: fixture.recommendations.find(item => item.symbol === url.searchParams.get("symbol")) || fixture.recommendations[0],
      profile: {}, market: fixture.market
    });
    if (url.pathname === "/api/markets") return respond({ markets: [
      { id: "us", label: "US Market", count: 8, totalSymbols: 8 },
      { id: "crypto", label: "Crypto", count: 0, totalSymbols: 0 }
    ] });
    if (url.pathname === "/api/watchlist") return respond({ ...fixture, market: { ...fixture.market, id: "watchlist" } });
    if (url.pathname === "/api/notifications") {
      if (route.request().method() !== "GET") state.notifications = route.request().postDataJSON()?.notifications || [];
      return respond({ notifications: state.notifications, version: 1 });
    }
    if (url.pathname === "/api/followed-trades") return respond({ followedEntries: [], followedTradeKeys: [], followedTradeAlerts: [], removedFollowedTradeKeys: [], version: 1 });
    if (url.pathname === "/api/ollama-status") return respond({ available: false });
    if (url.pathname === "/api/telemetry/web-vitals") return respond({ ok: true });
    return route.continue();
  });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  return { page, context, state };
}

async function checkContrast(page, label) {
  await page.evaluate(axe.source);
  const result = await page.evaluate(async () => window.axe.run(document, {
    runOnly: { type: "rule", values: ["color-contrast"] }
  }));
  recordVerification("contrast: " + label, () => assert.deepEqual(result.violations.map(({ id, nodes }) => ({
    id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary }))
  })), [], "Rendered contrast failed: " + label));
  checks.push(label + ": rendered text contrast");
}

async function waitState(page, state) {
  await page.locator('#terminal-home-v3[data-ui-state="' + state + '"]').waitFor({ state: "visible", timeout: 20000 });
}
async function waitView(page, view) {
  await page.waitForFunction(expected => document.body.dataset.appView === expected, view);
}
async function modalCheck(page, opener, panel, focusTarget) {
  activeCase = "modal " + panel;
  const button = page.locator(opener);
  await button.click();
  await page.locator(panel).waitFor({ state: "visible" });
  await page.waitForFunction(selector => document.querySelector(selector) === document.activeElement, focusTarget);
  await page.keyboard.press("Escape");
  await page.locator(panel).waitFor({ state: "hidden" });
  assert.equal(await button.getAttribute("aria-expanded"), "false");
  assert.equal(await button.evaluate(el => el === document.activeElement), true);
  checks.push(activeCase);
}

try {
  for (const capture of captures) {
    activeCase = capture.file;
    const { page, context } = await openPage(capture.viewport);
    await waitState(page, "fresh");
    await page.locator(".toast").waitFor({ state: "hidden", timeout: 12000 }).catch(async () => {
      await page.waitForFunction(() => document.querySelectorAll(".toast").length === 0, null, { timeout: 12000 });
    });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const box = selector => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
      };
      const visible = el => getComputedStyle(el).display !== "none" && el.getBoundingClientRect().height > 0;
      return {
        viewport: { width: innerWidth, height: innerHeight },
        document: { width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
        body: box("body"), shell: box(".app-shell.sfm-dashboard"), main: box("main"),
        rail: box(".desktop-trading-rail"), topbar: box(".topbar"), footer: box(".site-footer"),
        home: box("#terminal-home-v3"), lower: box(".v3-bottom-grid"),
        panels: [...document.querySelectorAll("#terminal-home-v3 > *, .v3-overview-grid > *, .v3-opportunity-grid > *")].map(el => {
          const bounds = el.getBoundingClientRect(), style = getComputedStyle(el);
          return { classes: el.className, top: bounds.top, height: bounds.height, minHeight: style.minHeight, rows: style.gridTemplateRows, gap: style.gap, padding: style.padding, margin: style.margin };
        }),
        brand: document.querySelector(".brand-lockup h1").textContent.trim(),
        brandTransform: getComputedStyle(document.querySelector(".brand-lockup h1")).textTransform,
        headerColor: getComputedStyle(document.querySelector(".brand-lockup h1")).color,
        legacyVisible: [...document.querySelectorAll("main > section:not(#terminal-home-v3):not(#temporary-legal-notices)")].filter(visible).map(el => el.id),
        actions: [...document.querySelectorAll(".v3-opportunity-card")].map(el => el.querySelectorAll("header > b").length),
        microsoftColors: [...document.querySelectorAll(".v3-opportunity-card .asset-logo-microsoft rect")].map(el => getComputedStyle(el).fill),
        controls: ["#language-quick-toggle", "#notification-button", "#settings-button", "#refresh-button"].map(selector => ({ selector, visible: visible(document.querySelector(selector)), ...box(selector) }))
      };
    });
    // Always preserve evidence before assertions so a layout failure is reviewable.
    await page.screenshot({ path: path.join(outputDirectory, capture.file), fullPage: false });
    measurements.push({ file: capture.file, ...result });
    await checkContrast(page, capture.file);
    console.log("Viewport measurements:", JSON.stringify(result));
    recordVerification(capture.file + ": geometry", () => {
    assert.equal(result.document.scrollWidth, capture.viewport.width, "Horizontal overflow");
    assert.equal(result.brand, "SFM Trader");
    assert.equal(result.brandTransform, "none", "Brand capitalization changed by CSS");
    assert.equal(result.headerColor, "rgb(255, 255, 255)");
    assert.deepEqual(result.legacyVisible, []);
    assert.equal(result.actions.length, 3);
    assert.deepEqual(result.actions, [1, 1, 1]);
    assert.deepEqual(result.microsoftColors, ["rgb(242, 80, 34)", "rgb(127, 186, 0)", "rgb(0, 164, 239)", "rgb(255, 185, 0)"]);
    for (const control of result.controls) {
      assert.ok(control.visible && control.width >= 40 && control.height >= 40, "Inaccessible control " + control.selector);
      assert.ok(control.left >= 0 && control.right <= capture.viewport.width, "Clipped control " + control.selector);
    }
    if (capture.viewport.width >= 1024) {
      assert.ok(result.shell.left >= 16 && result.shell.left <= 32, "Shell left " + result.shell.left);
      assert.ok(capture.viewport.width - result.shell.right >= 16 && capture.viewport.width - result.shell.right <= 32, "Shell right");
      assert.ok(result.rail.left >= result.shell.left && result.rail.right <= result.shell.right, "Rail containment");
      assert.ok(Math.abs(result.rail.top - result.topbar.top) <= 1, "Rail/topbar alignment");
      assert.ok(result.lower.top < capture.viewport.height, "Lower panels must begin within the viewport");
      assert.ok(result.footer.top - result.main.bottom <= 32, "Blank row before footer");
    }
    });
    checks.push(capture.file + ": geometry, brand, controls, logo colors");
    await modalCheck(page, "#settings-button", "#settings-panel", "#settings-display-name");
    await modalCheck(page, "#notification-button", "#notification-panel", "#notification-close-button");
    await page.locator("#language-quick-toggle").click();
    await page.waitForFunction(() => document.documentElement.lang === "en" && document.documentElement.dir === "ltr");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), capture.viewport.width, "English overflow");
    await page.locator("#language-quick-toggle").click();
    await page.waitForFunction(() => document.documentElement.lang === "ar" && document.documentElement.dir === "rtl");
    checks.push(capture.file + ": language and RTL");
    const nav = capture.viewport.width >= 1024 ? '.desktop-trading-rail [data-nav-key="opportunities"]' : '.ios-tab-link[data-tab="signals"]';
    await page.locator(nav).click();
    await waitView(page, "recommendations");
    await page.locator("#recommendations-section").waitFor({ state: "visible" });
    await checkContrast(page, "recommendations");
    await page.goBack();
    await waitView(page, "home");
    await waitState(page, "fresh");
    if (capture.viewport.width >= 1024) {
      for (const [key, view, selector] of [
        ["markets", "markets", "#markets-section"], ["favorites", "watchlist", "#watchlist-section"],
        ["portfolio", "portfolio", "#portfolio-section"], ["trades", "history", "#history-section"],
        ["calendar", "calendar", "#calendar-section"], ["news", "news", "#economic-news-section"],
        ["ai-analysis", "ai", "#command-center-section"], ["education", "education", "#education-section"]
      ]) {
        await page.locator('.desktop-trading-rail [data-nav-key="' + key + '"]').click();
        await waitView(page, view);
        await page.locator(selector).waitFor({ state: "visible" });
        if (view === "news") await page.locator("#economic-news-grid .market-feed-title").first().waitFor({ state: "visible" });
        if (view === "calendar") await page.locator("#economic-calendar-grid .calendar-feed-card").first().waitFor({ state: "visible" });
        await checkContrast(page, view);
        await page.goBack();
        await waitView(page, "home");
      }
      checks.push(capture.file + ": markets, watchlist, portfolio, history, calendar, back navigation");
    }
    await page.keyboard.press("Control+k");
    assert.equal(await page.locator("#terminal-symbol-search").evaluate(el => el === document.activeElement), true);
    await page.locator("#terminal-symbol-search").fill("مايكروسوفت");
    await page.locator("#terminal-search-options [role=option]").first().waitFor({ state: "visible" });
    await page.locator("#terminal-symbol-search").press("Enter");
    await page.waitForURL(/detail\.html\?symbol=MSFT/);
    await page.waitForFunction(() => document.querySelector("#detail-heading")?.textContent.includes("MSFT"));
    await checkContrast(page, "detail");
    await page.locator(".detail-back").click();
    await waitView(page, "home");
    await waitState(page, "fresh");
    assert.equal(await page.locator("#terminal-symbol-search").inputValue(), "مايكروسوفت");
    checks.push(capture.file + ": Arabic company search, same-tab details and return state");
    await context.close();
  }

  activeCase = "missing optional provider fields";
  const { page, context, state } = await openPage({ width: 1440, height: 900 }, "missing");
  await waitState(page, "fresh");
  assert.match(await page.locator("#v3-pulse-updated").innerText(), /--/);
  checks.push(activeCase);
  state.mode = "empty";
  await page.locator("#refresh-button").click();
  await waitState(page, "empty");
  assert.equal(await page.locator(".v3-opportunity-card").count(), 0);
  await page.locator("#v3-opportunity-grid .v3-panel-state").waitFor({ state: "visible" });
  checks.push("Empty data clears old cards without crashing");
  state.mode = "unavailable";
  await page.locator("#refresh-button").click();
  await waitState(page, "unavailable");
  await page.locator("[data-home-retry]").waitFor({ state: "visible" });
  checks.push("Provider unavailable has retry and no fabricated values");
  state.mode = "fresh";
  const before = state.requests;
  await page.locator("[data-home-retry]").click();
  await waitState(page, "fresh");
  assert.ok(state.requests > before);
  checks.push("Retry recovers through actual API request");
  state.mode = "unavailable";
  await page.locator("#refresh-button").click();
  await waitState(page, "stale");
  assert.equal(await page.locator("#connection-status").getAttribute("data-connection-state"), "stale");
  assert.equal(await page.locator(".v3-opportunity-card").count(), 3);
  checks.push("Network failure retains data and marks it stale");
  await context.close();

  activeCase = "independent feed failures and recovery";
  const failedFeeds = await openPage({ width: 1440, height: 900 }, "fresh", "unavailable");
  await waitState(failedFeeds.page, "fresh");
  await failedFeeds.page.waitForFunction(() => document.querySelector("#v3-calendar-list").dataset.uiState === "unavailable");
  assert.equal(await failedFeeds.page.locator(".v3-opportunity-card").count(), 3);
  await failedFeeds.page.locator('.desktop-trading-rail [data-nav-key="news"]').click();
  await waitView(failedFeeds.page, "news");
  const feedRetry = failedFeeds.page.locator("#economic-news-grid [data-feed-refresh]");
  await feedRetry.waitFor({ state: "visible" });
  failedFeeds.state.feedsMode = "fresh";
  await feedRetry.click();
  await failedFeeds.page.locator("#economic-news-grid .market-feed-title").first().waitFor({ state: "visible" });
  await failedFeeds.page.waitForFunction(() => document.querySelector("#economic-calendar-grid").dataset.uiState === "fresh");
  await checkContrast(failedFeeds.page, "news after recovery");
  checks.push("Feed failure does not erase market analysis; retry restores actual feed requests");
  await failedFeeds.context.close();

  activeCase = "controls while provider is loading";
  const loading = await openPage({ width: 390, height: 844 }, "loading");
  await waitState(loading.page, "loading");
  await modalCheck(loading.page, "#settings-button", "#settings-panel", "#settings-display-name");
  await waitState(loading.page, "fresh");
  await loading.context.close();
  assert.deepEqual(consoleErrors, [], consoleErrors.join("\n"));
  assert.deepEqual(verificationFailures, [], "All viewport and contrast assertions must pass");
  console.log(JSON.stringify({ checks, measurements }, null, 2));
} catch (error) {
  console.error("Home verification failed:", activeCase, error);
  console.error("Browser errors:", consoleErrors);
  if (activePage && !activePage.isClosed()) {
    await activePage.screenshot({ path: path.join(outputDirectory, "home-v3-failure.png"), fullPage: false });
    const diagnostic = await activePage.evaluate(() => ({
      view: document.body.dataset.appView,
      state: document.querySelector("#terminal-home-v3")?.dataset.uiState,
      text: document.body.innerText.slice(0, 2500)
    }));
    console.error(JSON.stringify(diagnostic));
  }
  throw error;
} finally {
  await writeFile(path.join(outputDirectory, "home-v3-final-corrected-manifest.json"), JSON.stringify({ captureMode: "viewport", fullPage: false, captures, checks, measurements, consoleErrors, verificationFailures }, null, 2) + "\n");
  await browser.close();
}
