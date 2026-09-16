# Mobile symbol drawer repair

The standalone drawer fetches `/api/asset?symbol=...` on opening a symbol and
supports bounded requests, explicit refresh, cancellation, a short-lived bounded
cache and exact-symbol response validation. Closing or switching symbols must
not allow late requests to reopen or overwrite the drawer.

`public/modules/symbolDetailData.js` preserves missing numbers, separates observed
daily changes from projected changes, and gates confidence and targets on data
quality. The concurrent main-branch integrity guards and analysis metrics remain
in use. Price movement alone is not a trading recommendation. Source observation
time must not be replaced by browser retrieval time.

The drawer has a compact mobile header, an independently scrollable body, refresh
and full-analysis actions, background isolation, Escape and focus restoration.
Service-worker assets are versioned so old clients can receive the repair.
Home V3 remains the final stylesheet. Mobile focus targets retain clearance above
the fixed tab bar, and reduced-motion preferences disable animated root scrolling.

## Verification

- `npm run verify`: syntax, unit, accessibility and production integration checks;
  database integration additionally requires `TEST_DATABASE_URL`.
- `node tools/capture-mobile-symbols.mjs`: isolated home and drawer fixtures over
  five phone/landscape/desktop sizes. Use `MOBILE_TEST_BROWSER=webkit` for WebKit.
  Covers cold load, retry after provider failure, wrong-symbol rejection and
  close/switch while a request is in flight. Data-state polling is independent
  of animation-frame scheduling; the state assertions remain unchanged.
- Existing `capture-home-v3.mjs` and `capture-deep-audit.mjs` remain intact and
  exercise the separate broader UI audit suites against the test server.

Run 35074492664 verified source `984bf99bf430b3cb5473cc9f329c978afed8d766`:
`npm run verify` passed, including all unit checks and integration against an
isolated Postgres test service. This source includes the concurrent main-branch
changes from `70828beb2092804abde214c9e65ae7121bc0cde8` without replacing their
integrity guards or existing browser audit tools. Consult that run's browser
steps and artifacts for their final status; unit success alone is not browser
acceptance. Regular PR CI separately checks the final branch.

Fixture data is only for tests and is not production market data. These tests do
not verify live provider subscription entitlements, current security prices,
exchange coverage or a physical iPhone. Missing evidence remains unavailable;
no fabricated prices, confidence values or investment targets are substituted.
