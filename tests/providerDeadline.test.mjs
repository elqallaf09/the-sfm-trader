import assert from "node:assert/strict";
import test from "node:test";

test("provider deadline aborts a stalled response body after headers", async context => {
  const originalFetch = globalThis.fetch;
  const keys = ["DATA_PROVIDER", "PROVIDER_REQUEST_TIMEOUT_MS", "PROVIDER_MAX_ATTEMPTS", "PROVIDER_MIN_START_GAP_MS"];
  const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  context.after(() => {
    globalThis.fetch = originalFetch;
    for (const key of keys) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  });
  Object.assign(process.env, { DATA_PROVIDER: "yahoo", PROVIDER_REQUEST_TIMEOUT_MS: "25", PROVIDER_MAX_ATTEMPTS: "1", PROVIDER_MIN_START_GAP_MS: "0" });
  let abortedBodies = 0;
  globalThis.fetch = async (_url, { signal }) => new Response(new ReadableStream({
    start(controller) {
      signal.addEventListener("abort", () => {
        abortedBodies++;
        controller.error(new DOMException("Aborted", "AbortError"));
      }, { once: true });
    }
  }), { status: 200 });
  const provider = await import("../src/dataProviders.mjs?body-deadline");
  const start = Date.now();
  await assert.rejects(provider.fetchChart("DEADLINE", { interval: "1d" }), /مهلة/);
  assert.equal(abortedBodies, 2);
  assert.ok(Date.now() - start < 1500);
});
