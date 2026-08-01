import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fetchChart, getConfiguredProvider } from "../src/dataProviders.mjs";

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
});
