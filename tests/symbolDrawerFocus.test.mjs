import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('symbol drawer records the activating button rather than assuming pointer focus', async () => {
  const app = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
  const bind = app.slice(app.indexOf('function sfmFinalBindRecommendationDetailButtons()'), app.indexOf('function sfmFinalRenderRecommendations(data)'));
  assert.match(bind, /const target = event\.currentTarget/);
  assert.match(bind, /sfmFinalDrawer\.returnFocusTo = target/);
  assert.ok(bind.indexOf('returnFocusTo = target') < bind.indexOf('sfmFinalRenderRecommendationDetail(row)'));
  assert.match(app, /sfmFinalDrawer\.returnFocusTo \?\?=/);
  const close = app.slice(app.indexOf('function sfmFinalCloseRecommendationDrawer()'), app.indexOf('function sfmFinalSetupRecommendationDrawer()'));
  assert.match(close, /if \(!sfmFinalDrawer\?\.classList\.contains\("is-open"\)\) return/);
  assert.ok(close.indexOf('element.inert = inert') < close.indexOf('returnFocusTo?.focus'));
});

test('mobile symbol triggers have bottom-navigation clearance and honor reduced motion', async () => {
  const css = await readFile(new URL('../public/symbol-detail-mobile.css', import.meta.url), 'utf8');
  assert.match(css, /scroll-padding-block-end: calc\(96px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(css, /\.recommendation-detail-button \{ scroll-margin-block: 96px/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*html \{ scroll-behavior: auto !important/);
});
