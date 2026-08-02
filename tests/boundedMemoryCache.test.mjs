import assert from "node:assert/strict";
import test from "node:test";
import { createBoundedMemoryCache } from "../public/modules/boundedMemoryCache.js";

test("browser memory cache bounds entries and refreshes recency", () => {
  const cache = createBoundedMemoryCache(2);
  cache.set("first", 1);
  cache.set("second", 2);
  assert.equal(cache.get("first"), 1);
  cache.set("third", 3);

  assert.equal(cache.size, 2);
  assert.equal(cache.get("second"), undefined);
  assert.equal(cache.get("first"), 1);
  assert.equal(cache.get("third"), 3);
});
