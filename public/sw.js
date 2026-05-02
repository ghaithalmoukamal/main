// Service Worker — Souq Al-Hirfiyeen
// Strategy: cache-first for static assets, network-first with fallback for pages/API

const CACHE_NAME = "souq-v1";
const OFFLINE_PAGE = "/ar";

const STATIC_ASSETS = [
  "/",
  "/ar",
  "/en",
  "/manifest.json",
];

// Install — pre-cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(() => {})
    )
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first for static, network-first for navigation
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== location.origin) return;

  // API routes — network only (never cache)
  if (url.pathname.startsWith("/api/")) return;

  // Static assets (/_next/static, /icons, /og-images) — cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached ?? fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return res;
        })
      )
    );
    return;
  }

  // Navigation pages — network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return res;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached ?? caches.match(OFFLINE_PAGE))
      )
  );
});

// Background sync — flush queued status changes when online
self.addEventListener("sync", (event) => {
  if (event.tag === "craftsman-status") {
    event.waitUntil(flushStatusQueue());
  }
});

async function flushStatusQueue() {
  // Read pending status changes from IndexedDB and POST to API
  // Implemented once service worker IndexedDB helpers are in place
}
