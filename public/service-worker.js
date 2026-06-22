const CACHE_NAME = "the-sfm-trader-ios-shell-v20260622-asset-logos-1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/detail.html",
  "/styles.css?v=20260622-asset-logos-1",
  "/app.js?v=20260622-asset-logos-1",
  "/detail.js?v=20260621-detail-arabic-1",
  "/manifest.webmanifest",
  "/assets/sfm-trader-logo.svg",
  "/the-sfm-trader-icon-256.png",
  "/the-sfm-trader-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
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
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") return response;
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        return response;
      });
    })
  );
});
