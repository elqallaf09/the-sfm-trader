import assert from "node:assert/strict";
import test from "node:test";
import { createMetrics } from "../src/metrics.mjs";

test("metrics aggregate request latency and validated web vitals", () => {
  const metrics = createMetrics({ startedAt: Date.now() - 2_000 });
  metrics.observeRequest({ method: "GET", path: "/api/markets", status: 200, durationMs: 10 });
  metrics.observeRequest({ method: "GET", path: "/api/markets", status: 200, durationMs: 30 });
  assert.equal(metrics.observeWebVital({ name: "LCP", value: 1200, rating: "good", page: "/" }), true);
  assert.equal(metrics.observeWebVital({ name: "BAD", value: 1, page: "/" }), false);
  const snapshot = metrics.snapshot();
  assert.equal(snapshot.requests[0].count, 2);
  assert.equal(snapshot.requests[0].averageDurationMs, 20);
  assert.equal(snapshot.webVitals[0].average, 1200);
});

test("metrics bound attacker-controlled series cardinality", () => {
  const metrics = createMetrics({ maxRequestSeries: 2, maxVitalSeries: 1 });
  for (let index = 0; index < 5; index += 1) {
    metrics.observeRequest({ method: "GET", path: `/api/unknown-${index}`, status: 404, durationMs: 1 });
    metrics.observeWebVital({ name: "LCP", value: 1000 + index, page: `/page-${index}` });
  }
  const snapshot = metrics.snapshot();
  assert.equal(snapshot.cardinality.requestSeries, 2);
  assert.equal(snapshot.cardinality.vitalSeries, 1);
  assert.equal(snapshot.cardinality.droppedRequestSeries, 3);
  assert.equal(snapshot.cardinality.droppedVitalSeries, 4);
});
