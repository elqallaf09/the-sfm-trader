# Audit repairs

Baseline: `d3e7f45901b0d2e95e4484604aedf39cc6be4d19`.

## Correctness and resilience

- Preserve missing numeric values separately from zero, including saved trades.
- Make the composite score monotonic with data health and consistent across dashboard/radar views.
- Require an explicit provider action; do not infer buy/sell or risk from a missing decision.
- Apply closed-session restrictions to market, watchlist and detail responses, including cache hits. Refresh the detail news overlay at response time.
- Keep provider, detail and state-request timeouts active through body consumption.
- Share pending market, watchlist and detail analyses separately from the result cache; bound pending-key cardinality.
- Load .env before any module snapshots configuration, preserving injected environment values.
- Allow startup with unavailable browser storage and keep fallback credentials in memory only.
- Serialize PostgreSQL writes before both first-row insertion and idempotency lookup.
- Keep server-generated notification update times out of the idempotency request hash.
- Return 404 for unknown page paths and enforce read-only methods consistently.

## Presentation and delivery

- Remove 696 earlier identical CSS declarations (639 important declarations) superseded by later matching rules in the same scope. Final per-selector declarations remain unchanged.
- Load fonts once from the page head and use the same base stylesheet ordering on both pages.
- Version the complete browser module graph and offline assets; revalidate code assets rather than serving a stale module graph.
- Retry unavailable or partial independent news/calendar feeds earlier while retaining the healthy-feed cache.
- Add browser fixtures for headlines and calendar events and require rendered contrast checks on Home, recommendations and navigated views.
- Correct runner context usage in the manual iOS workflow. Runner values are initialized inside a step.

## Verification recorded in the editing environment

- Preliminary JavaScript syntax compilation completed without failures.
- 23 existing source-contract checks passed in an isolated JavaScript harness; 3 DOM/binary-dependent cases were not run there.
- 8 new pure behavioral tests passed.
- 2 isolated storage-failure cases verified replacement and clearing without restoring stale credentials.
- Isolated cached-route checks returned the same closed-session action for market, watchlist and detail.
- A stalled-provider-body simulation verified that the timeout remains active and terminates the request.
- CSS comparison preserved all 9,050 final selector/property declarations.

The isolated harness does not replace Node, PostgreSQL or browser execution. The editing environment had no usable shell or browser. Full `npm run verify`, PostgreSQL concurrency tests, `npm audit`, rendered contrast and viewport captures must be read from the attached GitHub Actions results. No claim of successful live-provider or production-browser verification is made.

Default headline feeds remain general economic sources. Fresh company-specific coverage depends on the configured providers; missing market data is never replaced with production fixtures.
