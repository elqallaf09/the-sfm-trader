import assert from "node:assert/strict";
import test from "node:test";
import { createVisibilityAwarePoller } from "../public/modules/polling.js";

function createEventTarget(initial = {}) {
  const listeners = new Map();
  return {
    ...initial,
    addEventListener(name, listener) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(listener);
    },
    removeEventListener(name, listener) { listeners.get(name)?.delete(listener); },
    listenerCount(name) { return listeners.get(name)?.size || 0; }
  };
}

function createWindow() {
  const target = createEventTarget();
  let nextTimer = 0;
  const timers = new Map();
  return {
    ...target,
    setInterval(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
    clearInterval(id) { timers.delete(id); },
    tick() { for (const callback of [...timers.values()]) callback(); },
    timerCount() { return timers.size; }
  };
}

test("poller coalesces overlapping executions for the same task", async () => {
  const documentRef = createEventTarget({ hidden: false });
  const windowRef = createWindow();
  let resolveRun;
  let runs = 0;
  const poller = createVisibilityAwarePoller([{
    name: "quotes", intervalMs: 1_000,
    run: () => { runs += 1; return new Promise((resolve) => { resolveRun = resolve; }); }
  }], { documentRef, windowRef });
  poller.start();
  windowRef.tick();
  windowRef.tick();
  const manual = poller.refresh("quotes");
  await Promise.resolve();
  assert.equal(runs, 1);
  resolveRun();
  await manual;
  windowRef.tick();
  await Promise.resolve();
  assert.equal(runs, 2);
  resolveRun();
  poller.stop();
});

test("poller stop clears timers and listeners and start can attach them again", () => {
  const documentRef = createEventTarget({ hidden: false });
  const windowRef = createWindow();
  const poller = createVisibilityAwarePoller([
    { name: "quotes", intervalMs: 1_000, run() {} },
    { name: "invalid", intervalMs: 0, run() {} }
  ], { documentRef, windowRef });
  poller.start();
  assert.equal(windowRef.timerCount(), 1);
  assert.equal(documentRef.listenerCount("visibilitychange"), 1);
  assert.equal(windowRef.listenerCount("pagehide"), 1);
  poller.stop();
  assert.equal(windowRef.timerCount(), 0);
  assert.equal(documentRef.listenerCount("visibilitychange"), 0);
  assert.equal(windowRef.listenerCount("pagehide"), 0);
  poller.start();
  assert.equal(windowRef.timerCount(), 1);
  poller.stop();
});
