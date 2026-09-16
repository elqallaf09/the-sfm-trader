import assert from "node:assert/strict";
import test from "node:test";
test("denied browser storage does not break startup, requests, or token clearing", async context => {
  const original = globalThis.window;
  const requests = [];
  globalThis.window = {
    get localStorage() { throw new DOMException("Storage denied", "SecurityError"); },
    get sessionStorage() { throw new DOMException("Storage denied", "SecurityError"); },
    location: { origin: "https://example.test" },
    fetch: async (url, options) => { requests.push({ url, options }); return new Response("{}"); }
  };
  context.after(() => { globalThis.window = original; });
  const api = await import("../public/modules/apiClient.js?denied-storage");
  assert.equal(api.getApiToken(), "");
  api.setApiToken("test-session-token");
  await window.fetch("/api/markets");
  assert.equal(requests[0].options.headers.get("authorization"), "Bearer test-session-token");
  api.setApiToken("");
  await window.fetch("/api/markets");
  assert.equal(requests[1].options.headers.has("authorization"), false);
});

test("failed storage writes cannot restore an old token after replacement or clearing", async context => {
  const original = globalThis.window;
  const requests = [];
  globalThis.window = {
    localStorage: { removeItem() {} },
    sessionStorage: {
      getItem() { return "old-session-token"; },
      setItem() { throw new DOMException("Full", "QuotaExceededError"); },
      removeItem() { throw new DOMException("Denied", "SecurityError"); }
    },
    location: { origin: "https://example.test" },
    fetch: async (url, options) => { requests.push({ url, options }); return new Response("{}"); }
  };
  context.after(() => { globalThis.window = original; });
  const api = await import("../public/modules/apiClient.js?failed-storage-write");
  assert.equal(api.getApiToken(), "old-session-token");
  api.setApiToken("replacement");
  await window.fetch("/api/markets");
  assert.equal(requests[0].options.headers.get("authorization"), "Bearer replacement");
  api.setApiToken("");
  await window.fetch("/api/markets");
  assert.equal(api.getApiToken(), "");
  assert.equal(requests[1].options.headers.has("authorization"), false);
});
