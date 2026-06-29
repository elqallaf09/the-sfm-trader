const CACHE_NAME = "the-sfm-trader-v20260630-cinema";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/detail.html",
  "/styles.css?v=20260630-cinema",
  "/desktop-balance.css?v=20260630-cinema",
  "/cinema.css?v=20260630-cinema",
  "/app.js",
  "/detail.js",
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

  // Network-first for JS/CSS (always fresh), cache-first for images
  const isAsset = /\.(png|ico|svg|webp|jpg|jpeg|gif|woff2?)(\?|$)/.test(url.pathname);
  if (isAsset) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
