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
