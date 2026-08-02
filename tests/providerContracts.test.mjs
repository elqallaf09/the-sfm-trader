import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fetchChart, getConfiguredProvider, getProviderHealth } from "../src/dataProviders.mjs";

test("Yahoo provider adapter preserves the normalized chart contract", async (context) => {
  const fixture = JSON.parse(await readFile(new URL("./fixtures/yahoo-chart.json", import.meta.url), "utf8"));
  const originalFetch = globalThis.fetch;
  const originalProvider = process.env.DATA_PROVIDER;
  context.after(() => {
    globalThis.fetch = originalFetch;
    if (originalProvider === undefined) delete process.env.DATA_PROVIDER;
    else process.env.DATA_PROVIDER = originalProvider;
  });
  process.env.DATA_PROVIDER = "yahoo";
  globalThis.fetch = async () => new Response(JSON.stringify(fixture), { status: 200, headers: { "content-type": "application/json" } });

  const chart = await fetchChart("SFMTEST", { range: "5d", interval: "1d" });
  const result = chart.chart.result[0];
  assert.equal(getConfiguredProvider(), "yahoo");
  assert.equal(result.meta.symbol, "SFMTEST");
  assert.equal(result.meta.dataProvider, "Yahoo Finance");
  assert.deepEqual(result.indicators.quote[0].close, [100, 101, 102.5]);
  assert.equal(getProviderHealth().status, "healthy");
  assert.ok(getProviderHealth().lastSuccessAt);
});

test("provider response cache is bounded and evicts least-recently-used entries", async (context) => {
  const fixture = JSON.parse(await readFile(new URL("./fixtures/yahoo-chart.json", import.meta.url), "utf8"));
  const originalFetch = globalThis.fetch;
  const originalEnvironment = {
    DATA_PROVIDER: process.env.DATA_PROVIDER,
    PROVIDER_CACHE_MAX_ENTRIES: process.env.PROVIDER_CACHE_MAX_ENTRIES,
    PROVIDER_MIN_START_GAP_MS: process.env.PROVIDER_MIN_START_GAP_MS
  };
  context.after(() => {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(originalEnvironment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  process.env.DATA_PROVIDER = "yahoo";
  process.env.PROVIDER_CACHE_MAX_ENTRIES = "2";
  process.env.PROVIDER_MIN_START_GAP_MS = "0";
  let requests = 0;
  globalThis.fetch = async () => {
    requests += 1;
    return new Response(JSON.stringify(fixture), { status: 200, headers: { "content-type": "application/json" } });
  };
  const provider = await import(`../src/dataProviders.mjs?bounded-cache=${Date.now()}`);

  await provider.fetchChart("CACHEA", { range: "5d", interval: "1d" });
  await provider.fetchChart("CACHEB", { range: "5d", interval: "1d" });
  await provider.fetchChart("CACHEA", { range: "5d", interval: "1d" });
  await provider.fetchChart("CACHEC", { range: "5d", interval: "1d" });
  await provider.fetchChart("CACHEB", { range: "5d", interval: "1d" });

  assert.equal(requests, 4);
});

test("concurrent requests for one provider URL share a single upstream request", async (context) => {
  const fixture = JSON.parse(await readFile(new URL("./fixtures/yahoo-chart.json", import.meta.url), "utf8"));
  const originalFetch = globalThis.fetch;
  const originalProvider = process.env.DATA_PROVIDER;
  const originalGap = process.env.PROVIDER_MIN_START_GAP_MS;
  context.after(() => {
    globalThis.fetch = originalFetch;
    if (originalProvider === undefined) delete process.env.DATA_PROVIDER;
    else process.env.DATA_PROVIDER = originalProvider;
    if (originalGap === undefined) delete process.env.PROVIDER_MIN_START_GAP_MS;
    else process.env.PROVIDER_MIN_START_GAP_MS = originalGap;
  });
  process.env.DATA_PROVIDER = "yahoo";
  process.env.PROVIDER_MIN_START_GAP_MS = "0";
  let requests = 0;
  globalThis.fetch = async () => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return new Response(JSON.stringify(fixture), { status: 200, headers: { "content-type": "application/json" } });
  };
  const provider = await import(`../src/dataProviders.mjs?request-coalescing=${Date.now()}`);

  const results = await Promise.all(Array.from({ length: 8 }, () => (
    provider.fetchChart("COALESCE", { range: "5d", interval: "1d" })
  )));

  assert.equal(requests, 1);
  assert.equal(results.length, 8);
  assert.notEqual(results[0], results[1]);
  assert.deepEqual(results[0], results[1]);
});

test("provider honors bounded Retry-After before retrying rate limits", async (context) => {
  const fixture = JSON.parse(await readFile(new URL("./fixtures/yahoo-chart.json", import.meta.url), "utf8"));
  const originalFetch = globalThis.fetch;
  const originalEnvironment = {
    DATA_PROVIDER: process.env.DATA_PROVIDER,
    PROVIDER_MAX_ATTEMPTS: process.env.PROVIDER_MAX_ATTEMPTS,
    PROVIDER_MIN_START_GAP_MS: process.env.PROVIDER_MIN_START_GAP_MS,
    PROVIDER_MAX_RETRY_DELAY_MS: process.env.PROVIDER_MAX_RETRY_DELAY_MS
  };
  context.after(() => {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(originalEnvironment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  process.env.DATA_PROVIDER = "yahoo";
  process.env.PROVIDER_MAX_ATTEMPTS = "2";
  process.env.PROVIDER_MIN_START_GAP_MS = "0";
  process.env.PROVIDER_MAX_RETRY_DELAY_MS = "10";
  let requests = 0;
  globalThis.fetch = async () => {
    requests += 1;
    if (requests === 1) return new Response("", { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify(fixture), { status: 200, headers: { "content-type": "application/json" } });
  };
  const provider = await import(`../src/dataProviders.mjs?retry-after=${Date.now()}`);

  const chart = await provider.fetchChart("RETRY", { range: "5d", interval: "1d" });

  assert.equal(requests, 2);
  assert.equal(chart.chart.result[0].meta.dataProvider, "Yahoo Finance");
});
