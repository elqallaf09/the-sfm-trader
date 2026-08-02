const CACHE_NAME = "the-sfm-trader-v20260802-terminal-redesign-2";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/detail.html",
  "/styles.css?v=20260801-hardening-2",
  "/desktop-balance.css?v=20260801-hardening-2",
  "/cinema.css?v=20260801-hardening-2",
  "/layout-stability.css?v=20260802-dashboard-data-ux-4",
  "/dashboard-v2.css?v=20260802-terminal-redesign-2",
  "/app.js?v=20260802-dashboard-data-ux-3",
  "/detail.js?v=20260802-homepage-resilience",
  "/modules/apiClient.js",
  "/modules/polling.js",
  "/modules/uiState.js",
  "/legal.css",
  "/privacy.html",
  "/terms.html",
  "/risk-disclosure.html",
  "/modules/webVitals.js",
  "/modules/marketBackground.js",
  "/modules/boundedMemoryCache.js",
  "/modules/requestPolicy.js",
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
      fetch(request).catch(async () =>
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
