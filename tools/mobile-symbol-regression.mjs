// Isolated browser fixtures: values below are test data, never shipped market data.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit } from 'playwright';

const scenarios = [
  { width: 320, height: 740, language: 'ar' },
  { width: 390, height: 844, language: 'ar' },
  { width: 430, height: 932, language: 'en' },
  { width: 844, height: 390, language: 'en' },
  { width: 1440, height: 900, language: 'ar' },
];
function row(symbol, price = 151.23) {
  return { symbol, name: `Fixture ${symbol}`, currency: 'USD', currentPrice: price, confidence: 80, action: 'hold', target1: 160,
    expectedMovePct: 30, changePercent: 0, dataProvider: 'Fixture provider', reasons: ['Fixture explanation'], risk: { level: 'medium' },
    dataHealth: { coverage: 4, score: 80 }, dataProvenance: { marketTimestamp: new Date().toISOString(), freshness: 'current', provider: 'Fixture provider' },
    indicators: {}, timeframes: [], sparkline: [], updatedAt: new Date().toISOString() };
}
async function fixtureServer() {
  const root = path.resolve('public');
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const file = path.resolve(root, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
      if (!file.startsWith(root + path.sep)) throw new Error('Path');
      const data = await readFile(file);
      const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png' };
      response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); response.end(data);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}
export async function runCapture(mode = 'drawer') {
  const server = await fixtureServer(); const browserName = process.env.MOBILE_TEST_BROWSER || 'chromium';
  const browser = await (browserName === 'webkit' ? webkit : chromium).launch();
  const output = mode === 'home' ? '.artifacts/home-v3' : '.artifacts/deep-audit'; await mkdir(output, { recursive: true });
  const results = [];
  try {
    for (const setup of scenarios) {
      const context = await browser.newContext({ viewport: { width: setup.width, height: setup.height }, serviceWorkers: 'block', reducedMotion: 'reduce' });
      const page = await context.newPage(); const errors = []; const network = []; page.on('requestfailed', request => network.push({ url: request.url(), failure: request.failure() })); page.on('response', response => { if (response.url().includes('/api/asset')) network.push({ url: response.url(), status: response.status() }); }); page.on('pageerror', error => errors.push(error.message));
      let assetMode = 'success', assetCalls = 0;
      await page.addInitScript(language => {
        localStorage.setItem('the-sfm-trader-settings', JSON.stringify({ language }));
        sessionStorage.setItem('the-sfm-trader-skip-intro', '1');
      }, setup.language);
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.origin !== server.origin) return route.abort();
        if (!url.pathname.startsWith('/api/')) return route.continue();
        if (url.pathname === '/api/asset') {
          assetCalls++;
          if (assetMode === 'fail') return route.fulfill({ status: 429, json: { error: 'Fixture rate limit' } });
          if (assetMode === 'slow') await new Promise(resolve => setTimeout(resolve, 350));
          const symbol = url.searchParams.get('symbol');
          return route.fulfill({ status: 200, json: { asset: { symbol }, recommendation: row(assetMode === 'wrong' ? 'NVDA' : symbol, 152.34) } });
        }
        let payload = { items: [], data: [], notifications: [], followedTrades: [], followedTradeKeys: [], followedEntries: [], status: 'unavailable' };
        if (url.pathname === '/api/markets') payload = { markets: [{ id: 'us', label: 'US fixture', count: 2 }] };
        if (['/api/recommendations', '/api/watchlist'].includes(url.pathname)) payload = { market: { id: 'us', label: 'US fixture', totalSymbols: 2 }, recommendations: [row('MSFT'), row('AAPL')], generatedAt: new Date().toISOString(), dataProvider: { active: 'Fixture provider' } };
        return route.fulfill({ status: 200, json: payload });
      });
      try {
        await page.goto(`${server.origin}/#view-${mode === 'home' ? 'home' : 'recommendations'}`, { waitUntil: 'domcontentloaded' });
        if (mode === 'drawer') {
          const button = page.locator('button[data-recommendation-index="0"]:visible').first(); await button.waitFor({ state: 'visible' });
          await button.click(); const drawer = page.locator('[data-recommendation-drawer]');
          await page.waitForFunction(() => document.querySelector('#recommendation-detail-content')?.textContent.includes('152.34'));
          assert.ok(assetCalls > 0, 'cold drawer must fetch exact symbol');
          assert.equal(await drawer.locator('[data-symbol-full]').getAttribute('href'), '/detail.html?symbol=MSFT');
          assert.ok((await drawer.innerText()).includes('Fixture provider'));
          assert.ok(!(await drawer.innerText()).includes('30.00%'), 'forecast must not be shown as daily change');
          assetMode = 'fail'; await drawer.locator('[data-symbol-retry]').click();
          await page.waitForFunction(() => !document.querySelector('[data-symbol-retry]')?.disabled && /Retry|أعد المحاولة/.test(document.querySelector('[data-symbol-retry]')?.textContent || ''));
          assetMode = 'success'; await drawer.locator('[data-symbol-retry]').click();
          await page.waitForFunction(() => document.querySelector('#recommendation-detail-content')?.getAttribute('aria-busy') === 'false');
          const rect = await drawer.locator('.recommendation-drawer-panel').evaluate(element => {
            const r = element.getBoundingClientRect(), content = element.querySelector('.recommendation-detail-content').getBoundingClientRect();
            return { left: r.left, right: r.right, height: r.height, content: content.height, overflow: element.scrollWidth > element.clientWidth + 1 };
          });
          assert.ok(rect.left >= -1 && rect.right <= setup.width + 1, JSON.stringify(rect));
          assert.ok(rect.height <= setup.height + 1 && rect.content > 75, JSON.stringify(rect)); assert.equal(rect.overflow, false);
          await page.screenshot({ path: `${output}/${browserName}-${setup.width}-${setup.language}.png`, scale: 'css' });
          assetMode = 'wrong'; await drawer.locator('[data-symbol-retry]').click();
          await page.waitForFunction(() => /Retry|أعد المحاولة/.test(document.querySelector('[data-symbol-retry]')?.textContent || ''));
          assert.ok(!(await drawer.innerText()).includes('Fixture NVDA'), 'wrong-symbol result must be rejected');
          assetMode = 'slow'; await drawer.locator('[data-symbol-retry]').click();
          await drawer.locator('button[data-recommendation-close]').click();
          assert.equal(await drawer.getAttribute('aria-hidden'), 'true');
          await page.locator('button[data-recommendation-index="1"]:visible').first().click();
          await page.waitForFunction(() => document.querySelector('#recommendation-detail-content')?.textContent.includes('Fixture AAPL') && document.querySelector('#recommendation-detail-content')?.getAttribute('aria-busy') === 'false');
          assert.ok(!(await drawer.innerText()).includes('Fixture MSFT'), 'late MSFT result must not overwrite AAPL');
          await page.keyboard.press('Escape'); assert.equal(await drawer.getAttribute('aria-hidden'), 'true');
          assert.ok(await page.locator('button[data-recommendation-index="1"]:visible').first().evaluate(element => element === document.activeElement));
        } else {
          await page.locator('.topbar').waitFor({ state: 'visible' });
          const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
          assert.ok(layout.scroll <= layout.width + 1, JSON.stringify(layout));
          await page.screenshot({ path: `${output}/${browserName}-${setup.width}-${setup.language}.png`, scale: 'css' });
        }
        assert.deepEqual(errors, []); results.push({ ...setup, browserName, passed: true, assetCalls });
      } catch (error) {
        await page.screenshot({ path: `${output}/FAILED-${browserName}-${setup.width}.png`, scale: 'css' });
        await writeFile(`${output}/failure.json`, JSON.stringify({ error: error.message, stack: error.stack, errors, network, assetCalls, setup, drawer: await page.locator("[data-recommendation-drawer]").innerText().catch(() => "closed") }, null, 2)); throw error;
      } finally { await context.close(); }
    }
  } finally {
    await writeFile(`${output}/manifest-${browserName}.json`, JSON.stringify({ fixtures: true, results }, null, 2));
    await browser.close(); await server.close();
  }
  console.log(`${mode}: ${results.length} viewport/browser fixture journeys passed (${browserName}).`);
}
