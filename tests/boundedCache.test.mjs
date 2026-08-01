import test from "node:test";
import assert from "node:assert/strict";
import { createBoundedCache } from "../src/boundedCache.mjs";

test("bounded cache evicts the least recently used entry", () => {
  const cache = createBoundedCache({ maxEntries: 2, maxAgeMs: 60_000 });
  cache.set("a", { createdAt: Date.now(), value: 1 });
  cache.set("b", { createdAt: Date.now(), value: 2 });
  assert.equal(cache.get("a").value, 1);
  cache.set("c", { createdAt: Date.now(), value: 3 });
  assert.equal(cache.get("b"), undefined);
  assert.equal(cache.get("a").value, 1);
  assert.equal(cache.get("c").value, 3);
});

test("bounded cache removes stale entries", () => {
  const cache = createBoundedCache({ maxEntries: 2, maxAgeMs: 100 });
  cache.set("stale", { createdAt: Date.now() - 101, value: true });
  assert.equal(cache.get("stale"), undefined);
  assert.equal(cache.size, 0);
});
