import assert from "node:assert/strict";
import test from "node:test";
import { initMarketBackground } from "../public/modules/marketBackground.js";

test("market background caps pixel density and releases lifecycle listeners", () => {
  const listeners = new Map();
  const removed = [];
  let nextFrame = 0;
  const context = new Proxy({}, { get: (target, key) => target[key] || (() => {}) });
  const canvas = { style: {}, getContext: () => context };
  const media = {
    matches: true,
    addEventListener: (name, handler) => listeners.set(`media:${name}`, handler),
    removeEventListener: (name) => removed.push(`media:${name}`)
  };
  const windowRef = {
    innerWidth: 400,
    innerHeight: 800,
    devicePixelRatio: 4,
    matchMedia: () => media,
    requestAnimationFrame: () => ++nextFrame,
    cancelAnimationFrame: () => {},
    addEventListener: (name, handler) => listeners.set(`window:${name}`, handler),
    removeEventListener: (name) => removed.push(`window:${name}`)
  };
  const documentRef = {
    hidden: false,
    querySelector: () => canvas,
    addEventListener: (name, handler) => listeners.set(`document:${name}`, handler),
    removeEventListener: (name) => removed.push(`document:${name}`)
  };

  const controller = initMarketBackground({ windowRef, documentRef, canvas });
  assert.equal(canvas.width, 800);
  assert.equal(canvas.height, 1600);
  assert.equal(nextFrame, 0);

  controller.stop();
  assert.deepEqual(removed.sort(), ["document:visibilitychange", "media:change", "window:pagehide", "window:resize"]);
});
