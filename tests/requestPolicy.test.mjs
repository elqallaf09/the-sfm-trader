import assert from "node:assert/strict";
import test from "node:test";
import { fetchJsonWithPolicy, fetchResponseWithPolicy, isRetryableStatus, parseRetryAfterMs } from "../public/modules/requestPolicy.js";

test("request policy bounds Retry-After values", () => {
  assert.equal(parseRetryAfterMs("2", 0, 5_000), 2_000);
  assert.equal(parseRetryAfterMs("999", 0, 5_000), 5_000);
  assert.equal(parseRetryAfterMs("invalid", 0, 5_000), null);
  assert.equal(isRetryableStatus(429), true);
  assert.equal(isRetryableStatus(503), true);
  assert.equal(isRetryableStatus(400), false);
});

test("request policy retries transient responses but not permanent client errors", async () => {
  let requests = 0;
  const data = await fetchJsonWithPolicy("/api/test", {
    retries: 1, retryDelayMs: 0,
    fetchRef: async () => (++requests === 1
      ? new Response(JSON.stringify({ error: "busy" }), { status: 503 })
      : new Response(JSON.stringify({ ok: true }), { status: 200 }))
  });
  assert.deepEqual(data, { ok: true });
  assert.equal(requests, 2);

  let permanentRequests = 0;
  await assert.rejects(() => fetchJsonWithPolicy("/api/test", {
    retries: 3,
    fetchRef: async () => { permanentRequests += 1; return new Response(JSON.stringify({ error: "invalid" }), { status: 400 }); }
  }), /invalid/);
  assert.equal(permanentRequests, 1);
});

test("request policy aborts stalled requests within the configured timeout", async () => {
  await assert.rejects(() => fetchJsonWithPolicy("/api/test", {
    timeoutMs: 10,
    fetchRef: (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true }))
  }), /انتهت مهلة الاتصال/);
});

test("response policy preserves state headers and bounds non-JSON requests", async () => {
  const response = await fetchResponseWithPolicy("/api/state", {
    fetchRef: async () => new Response("", { status: 200, headers: { "x-state-version": "7" } })
  });
  assert.equal(response.headers.get("x-state-version"), "7");

  const conflict = await fetchResponseWithPolicy("/api/state", {
    acceptStatuses: [409],
    fetchRef: async () => new Response("", { status: 409 })
  });
  assert.equal(conflict.status, 409);

  await assert.rejects(() => fetchResponseWithPolicy("/api/state", {
    timeoutMs: 10,
    fetchRef: (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true }))
  }), /Ø§Ù†ØªÙ‡Øª Ù…Ù‡Ù„Ø© Ø§Ù„Ø§ØªØµØ§Ù„/);
});

test("state and telemetry requests use the bounded response policy", async () => {
  const [app, webVitals] = await Promise.all([
    import("node:fs/promises").then(({ readFile }) => readFile(new URL("../public/app.js", import.meta.url), "utf8")),
    import("node:fs/promises").then(({ readFile }) => readFile(new URL("../public/modules/webVitals.js", import.meta.url), "utf8"))
  ]);
  assert.match(app, /fetchResponseWithPolicy\("\/api\/followed-trades"/);
  assert.match(app, /fetchResponseWithPolicy\("\/api\/notifications"/);
  assert.match(app, /await response\.text\(\);/);
  assert.match(webVitals, /fetchResponseWithPolicy\("\/api\/telemetry\/web-vitals"/);
  assert.match(webVitals, /response\.body\?\.cancel\(\)/);
});

test("request policy does not wait to retry after the caller aborts", async () => {
  const controller = new AbortController();
  let requests = 0;
  const pending = fetchJsonWithPolicy("/api/test", {
    retries: 2,
    retryDelayMs: 5_000,
    signal: controller.signal,
    fetchRef: async () => {
      requests += 1;
      controller.abort();
      throw new Error("network failed");
    }
  });
  await assert.rejects(pending);
  assert.equal(requests, 1);
});
