const CACHE_NAME = "the-sfm-trader-v20260914-deep-audit-1";
const STATIC_ASSETS = [
  "/modules/marketIntegrity.js?v=20260914-deep-audit-1",
  "/modules/shellInteractions.js?v=20260914-issue36-ui-1",
  "/",
  "/index.html",
  "/detail.html",
  "/color-tokens.css?v=20260914-audit-repair-1",
  "/styles.css?v=20260914-css-syntax-1",
  "/desktop-balance.css?v=20260914-audit-repair-1",
  "/cinema.css?v=20260914-audit-repair-1",
  "/layout-stability.css?v=20260804-home-v3-layout-fix-1",
  "/dashboard-v2.css?v=20260914-view-routing-1",
  "/app.js?v=20260914-deep-audit-1",
  "/detail.js?v=20260914-deep-audit-1",
  "/modules/apiClient.js?v=20260914-audit-repair-1",
  "/modules/polling.js?v=20260914-audit-repair-1",
  "/modules/uiState.js?v=20260914-audit-repair-1",
  "/legal.css",
  "/privacy.html",
  "/terms.html",
  "/risk-disclosure.html",
  "/modules/webVitals.js?v=20260914-audit-repair-1",
  "/modules/marketBackground.js?v=20260914-audit-repair-1",
  "/modules/boundedMemoryCache.js?v=20260914-audit-repair-1",
  "/modules/requestPolicy.js?v=20260914-audit-repair-1",
  "/modules/assetBranding.js?v=20260914-audit-repair-1",
  "/modules/homeDashboard.js?v=20260914-audit-repair-1",
  "/modules/instrumentSearch.js?v=20260914-audit-repair-1",
  "/modules/recommendationList.js?v=20260914-audit-repair-1",
  "/modules/detailNavigation.js?v=20260914-audit-repair-1",
  "/modules/analysisMetrics.js?v=20260914-audit-repair-1",
  "/modules/numberValue.js?v=20260914-audit-repair-1",
  "/modules/html.js?v=20260914-audit-repair-1",
  "/modules/marketFeeds.js?v=20260914-audit-repair-1",
  "/market-feeds.css?v=20260914-audit-repair-1",
  "/analysis-metrics.css?v=20260914-audit-repair-1",
  "/instrument-search.css?v=20260914-audit-repair-1",
  "/detail-brand.css?v=20260914-detail-navigation-1",
  "/manifest.webmanifest",
  "/assets/sfm-trader-logo.svg",
  "/the-sfm-trader-icon-256.png",
  "/the-sfm-trader-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(STATIC_ASSETS.map((asset) => cache.add(asset)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (request.headers.has("range")) return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-cache" }).catch(async () =>
        (await caches.match(request)) ||
        (await caches.match(url.pathname === "/detail.html" ? "/detail.html" : "/index.html")) ||
        Response.error()
      )
    );
    return;
  }

  // Network-first for JS/CSS (always fresh), cache-first for images
  const isAsset = /\.(png|ico|svg|webp|jpg|jpeg|gif|woff2?)(\?|$)/.test(url.pathname);
  if (isAsset) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          const clone = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)));
        }
        return response;
      }))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          const clone = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
