import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.VISUAL_BASE_URL || "http://127.0.0.1:4173";
const outputDirectory = path.resolve(process.env.VISUAL_OUTPUT_DIR || ".artifacts/home-v3");

const recommendations = [
  ["META", "Meta Platforms", 590.24, 562.73, 89, 4.66, "buy", "شراء"],
  ["MSFT", "Microsoft Corp.", 487.65, 521.79, 86, 7.00, "buy", "شراء"],
  ["AAPL", "Apple Inc.", 303.42, 314.36, 82, 3.61, "hold", "انتظار"],
  ["GOOGL", "Alphabet Inc.", 238.40, 247.94, 80, 4.00, "buy", "شراء"],
  ["AMD", "Advanced Micro Devices Inc.", 168.90, 175.84, 78, 4.11, "buy", "شراء"],
  ["AVGO", "Broadcom Inc.", 341.80, 357.97, 76, 4.73, "buy", "شراء"],
  ["LLY", "Eli Lilly and Co.", 724.20, 750.42, 73, 3.62, "hold", "انتظار"],
  ["NVDA", "NVIDIA Corp.", 181.60, 188.86, 71, 4.00, "buy", "شراء"]
].map(([symbol, name, currentPrice, target1, confidence, expectedMovePct, action, actionLabel]) => ({
  symbol,
  name,
  currentPrice,
  target1,
  expectedPrice: target1,
  confidence,
  expectedMovePct,
  action,
  actionLabel,
  currency: "USD",
  market: "us"
}));

const fixture = {
  recommendations,
  cached: false,
  refreshing: false,
  dataStatus: "fresh",
  economicCalendar: {
    hotEvents: [
      { title: "US Nonfarm Payrolls", currency: "USD", impact: "high", date: "2026-09-04", time: "15:30", localTimeLabel: "15:30" },
      { title: "ECB Interest Rate Decision", currency: "EUR", impact: "high", date: "2026-09-10", time: "15:15", localTimeLabel: "15:15" }
    ],
    upcoming: []
  },
  smartAlerts: [],
  market: { id: "us", label: "US Market", supportedSymbols: recommendations }
};

const captures = [
  { file: "home-v3-final-corrected-1680x945.png", viewport: { width: 1680, height: 945 } },
  { file: "home-v3-final-corrected-1440x900.png", viewport: { width: 1440, height: 900 } },
  { file: "home-v3-final-corrected-mobile-390x844.png", viewport: { width: 390, height: 844 } }
];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const consoleErrors = [];
const measurements = [];

try {
  for (const capture of captures) {
    const context = await browser.newContext({ viewport: capture.viewport, serviceWorkers: "block", colorScheme: "dark" });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(`${capture.file}: ${message.text()}`);
    });
    page.on("pageerror", (error) => consoleErrors.push(`${capture.file}: ${error.message}`));
    await page.route("**/api/recommendations*", (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(fixture)
    }));
    await page.route("**/api/ollama-status", (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ available: false })
    }));

    const verificationUrl = new URL(baseUrl);
    verificationUrl.searchParams.set("visual-test", "1");
    await page.goto(verificationUrl.href, { waitUntil: "networkidle" });
    // Render the deterministic verification payload explicitly after application
    // startup. This keeps fixture data confined to the browser test and avoids a
    // startup race with the app's initial market/request sequence.
    await page.evaluate((data) => {
      window.__SFM_RENDER_HOME_V3__?.(data);
    }, fixture);
    await page.locator("#terminal-home-v3[data-ui-state='fresh']").waitFor({ state: "visible", timeout: 20_000 });

    const result = await page.evaluate(() => {
      const box = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
      };
      const shell = box(".app-shell.sfm-dashboard");
      const main = box(".app-shell.sfm-dashboard > main");
      const rail = box(".desktop-trading-rail");
      const footer = box(".site-footer");
      const lower = box(".v3-bottom-grid");
      const opportunityCards = [...document.querySelectorAll(".v3-opportunity-card")];
      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
        shell,
        main,
        rail,
        footer,
        lower,
        appView: document.body.dataset.appView,
        brand: document.querySelector(".brand-lockup h1")?.textContent?.trim(),
        railBrand: document.querySelector(".sidebar-brand-text strong")?.textContent?.trim(),
        legacyHomeVisible: [...document.querySelectorAll("main > section:not(#terminal-home-v3):not(#temporary-legal-notices)")].some((element) => {
          const style = getComputedStyle(element);
          return style.display !== "none" && style.visibility !== "hidden" && element.getBoundingClientRect().height > 0;
        }),
        actionBadgeCounts: opportunityCards.map((card) => card.querySelectorAll("header > b").length),
        duplicateActionMetric: opportunityCards.some((card) => [...card.querySelectorAll(".v3-opportunity-metrics > div > span:first-child")].some((label) => label.textContent?.trim() === "الإجراء")),
        horizontalOverflow: document.documentElement.scrollWidth !== window.innerWidth,
        overlay: Boolean(document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay"))
      };
    });

    assert.equal(result.appView, "home", capture.file);
    assert.equal(result.brand, "SFM Trader", capture.file);
    assert.equal(result.railBrand, "SFM Trader", capture.file);
    assert.equal(result.legacyHomeVisible, false, capture.file);
    assert.equal(result.horizontalOverflow, false, capture.file);
    assert.equal(result.overlay, false, capture.file);
    assert.equal(result.duplicateActionMetric, false, capture.file);
    assert.ok(result.actionBadgeCounts.every((count) => count === 1), capture.file);

    if (capture.viewport.width >= 1024) {
      assert.ok(result.shell.left >= 13 && result.shell.left <= 17, `${capture.file}: shell left ${result.shell.left}`);
      assert.ok(capture.viewport.width - result.shell.right >= 13 && capture.viewport.width - result.shell.right <= 21, `${capture.file}: shell right ${capture.viewport.width - result.shell.right}`);
      assert.ok(result.rail.left >= result.shell.left && result.rail.right <= result.shell.right, `${capture.file}: rail containment`);
      assert.ok(result.main.left >= result.shell.left && result.main.right <= result.shell.right, `${capture.file}: main containment`);
      assert.ok(result.lower.top <= capture.viewport.height + 120, `${capture.file}: lower dashboard starts at ${result.lower.top}`);
    }

    await page.screenshot({ path: path.join(outputDirectory, capture.file), fullPage: false });
    measurements.push({ file: capture.file, ...result });
    await context.close();
  }
} finally {
  await browser.close();
}

assert.deepEqual(consoleErrors, [], consoleErrors.join("\n"));
await writeFile(path.join(outputDirectory, "home-v3-final-corrected-manifest.json"), `${JSON.stringify({ captureMode: "viewport", fullPage: false, captures, measurements }, null, 2)}\n`);
console.log(JSON.stringify(measurements, null, 2));
