import assert from "node:assert/strict";
import test from "node:test";

test("concurrent calendar reads share one upstream request", async (context) => {
  const originalFetch = globalThis.fetch;
  const originalTimeout = process.env.ECONOMIC_CALENDAR_TIMEOUT_MS;
  context.after(() => {
    globalThis.fetch = originalFetch;
    if (originalTimeout === undefined) delete process.env.ECONOMIC_CALENDAR_TIMEOUT_MS;
    else process.env.ECONOMIC_CALENDAR_TIMEOUT_MS = originalTimeout;
  });
  process.env.ECONOMIC_CALENDAR_TIMEOUT_MS = "1000";
  let requests = 0;
  globalThis.fetch = async () => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return new Response("<weeklyevents></weeklyevents>", { status: 200 });
  };
  const calendar = await import(`../src/economicCalendar.mjs?coalescing=${Date.now()}`);

  await Promise.all(Array.from({ length: 8 }, () => calendar.getEconomicCalendarForMarket("us", [])));

  assert.equal(requests, 1);
});

test("calendar rejects oversized upstream responses without exposing their body", async (context) => {
  const originalFetch = globalThis.fetch;
  const originalLimit = process.env.ECONOMIC_CALENDAR_MAX_BYTES;
  context.after(() => {
    globalThis.fetch = originalFetch;
    if (originalLimit === undefined) delete process.env.ECONOMIC_CALENDAR_MAX_BYTES;
    else process.env.ECONOMIC_CALENDAR_MAX_BYTES = originalLimit;
  });
  process.env.ECONOMIC_CALENDAR_MAX_BYTES = "16";
  globalThis.fetch = async () => new Response("x".repeat(17), {
    status: 200,
    headers: { "content-length": "17" }
  });
  const calendar = await import(`../src/economicCalendar.mjs?size-limit=${Date.now()}`);

  const payload = await calendar.getEconomicCalendarForMarket("us", []);

  assert.deepEqual(payload.upcoming, []);
  assert.match(payload.error, /too large/);
});

test("calendar failure cooldown prevents repeated upstream hammering", async (context) => {
  const originalFetch = globalThis.fetch;
  const originalRetry = process.env.ECONOMIC_CALENDAR_RETRY_DELAY_MS;
  context.after(() => {
    globalThis.fetch = originalFetch;
    if (originalRetry === undefined) delete process.env.ECONOMIC_CALENDAR_RETRY_DELAY_MS;
    else process.env.ECONOMIC_CALENDAR_RETRY_DELAY_MS = originalRetry;
  });
  process.env.ECONOMIC_CALENDAR_RETRY_DELAY_MS = "1000";
  let requests = 0;
  globalThis.fetch = async () => {
    requests += 1;
    throw new Error("provider unavailable");
  };
  const calendar = await import(`../src/economicCalendar.mjs?failure-cooldown=${Date.now()}`);

  const first = await calendar.getEconomicCalendarForMarket("us", []);
  const second = await calendar.getEconomicCalendarForMarket("us", []);

  assert.equal(requests, 1);
  assert.match(first.error, /provider unavailable/);
  assert.match(second.error, /provider unavailable/);
});
