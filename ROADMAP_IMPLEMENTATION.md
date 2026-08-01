# Remediation roadmap implementation

This repository implements the approved remediation plan as one release candidate.

| ID | Delivery |
|---|---|
| SEC-01 | Bearer authentication middleware and user-scoped state routes. |
| DATA-01 | PostgreSQL user-state and idempotency tables, constraints, indexes, migration, and file fallback. |
| SEC-02 | HTTPS production policy, strict CORS allowlist, browser security headers, trusted-proxy-aware rate limiting. |
| DATA-02 | Atomic writes, optimistic versions (`If-Match`), idempotency keys, conflict responses, and retry-safe clients. |
| CI-01 | Syntax, unit, provider contract, axe, production, PostgreSQL, CSS audit, and dependency audit gates. |
| ARCH-01 | Storage, security, HTTP limits, caching, metrics, and static delivery extracted from the server entry point. |
| ARCH-02 | Shared API client, Web Vitals reporter, and polling scheduler extracted from the main UI module. |
| CSS-01 | Conservative selector inventory plus removal of confirmed obsolete selector families. |
| PERF-01 | ETag, Brotli, bounded caches, versioned PWA cache, stale-while-revalidate, and response budgets. |
| PERF-02 | Visibility-aware consolidated polling with foreground recovery; SSE/WebSocket deferred until measurements justify persistent connections. |
| TRUTH-01 | Provider/source/freshness metadata and no fabricated static live news. |
| TEST-01 | Provider fixtures, store/unit contracts, production API integration, PostgreSQL integration, and accessibility regression tests. |
| A11Y-01 | Keyboard/focus behavior, semantic ARIA roles, live accessibility gate via axe. |
| UX-01 | Shared loading/error/stale handling and background refresh without blocking the current screen. |
| iOS-01 | HTTPS-only release configuration, privacy manifest, and TestFlight release runbook. |
| OBS-01 | Structured access logs, readiness/provider/storage health, request metrics, and Web Vitals ingestion. |

## Deployment order

1. Apply `migrations/001_user_state.sql` to the production database.
2. Set `SFM_STORAGE_DRIVER=postgres`, `DATABASE_URL`, `SFM_AUTH_TOKENS`, and `SFM_ALLOWED_ORIGINS` using the platform secret manager.
3. Run `npm ci && npm run verify && npm audit --audit-level=high`.
4. Deploy to staging, validate `/api/ready`, authenticated `/api/metrics`, conflicts/retries, and provider freshness.
5. Roll out gradually and monitor latency, error rate, provider/storage health, and LCP/INP/CLS.

The repository now includes a non-root production `Dockerfile`, a Render Blueprint, configuration preflight checks, serialized checksum-tracked migrations, and a CI container build gate.
