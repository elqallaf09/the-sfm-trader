import assert from "node:assert/strict";
import test from "node:test";
import { createSharedTasks } from "../src/sharedTasks.mjs";

test("concurrent cold requests share work until its final result is cached", async () => {
  const registry = createSharedTasks();
  let started = 0, finish;
  const start = () => ({ done: new Promise(resolve => { started++; finish = resolve; }) });
  const tasks = Array.from({ length: 12 }, () => registry.getOrCreate("market:us", start));
  assert.equal(started, 1);
  assert.ok(tasks.every(task => task === tasks[0]));
  finish({ recommendations: [] });
  await tasks[0].done;
  assert.equal(registry.size, 0);
});

test("failed work releases its key and overload is bounded", async () => {
  const registry = createSharedTasks({ maxEntries: 1 });
  let reject;
  const task = registry.getOrCreate("market:us", () => ({ done: new Promise((_, fail) => { reject = fail; }) }));
  assert.throws(() => registry.getOrCreate("market:crypto", () => ({})), error => error.statusCode === 503);
  reject(new Error("provider offline"));
  await assert.rejects(task.done, /offline/);
  assert.equal(registry.size, 0);
  assert.equal(await registry.getOrCreate("market:us", () => ({ done: Promise.resolve(1) })).done, 1);
});
