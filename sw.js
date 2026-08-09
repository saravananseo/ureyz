/* UREYZ service worker — cache-first app shell for offline install
   v2: bumped cache name to force-invalidate any stale cache from earlier
   installs, added query-string cache-busting on asset URLs, and fixed a
   bug where a failed network fetch with no cache match could resolve
   with `undefined` (breaking the request entirely). */
const CACHE_NAME = 'ureyz-cache-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css?v=2',
  './app.js?v=2',
  './manifest.json?v=2',
  './assets/hero-crowd.jpg?v=2',
  './assets/showcase-panel.jpg?v=2',
  './assets/showcase-plaques.jpg?v=2',
  './assets/dream-chests.jpg?v=2',
  './assets/vip-checkin.jpg?v=2',
  './assets/lifestyle-ad.jpg?v=2',
  './assets/sunset-crowd.jpg?v=2',
  './assets/logo-lockup.png?v=2',
  './assets/shield.png?v=2',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/favicon.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Cache each asset independently so one missing/failed file can't
      // abort caching of everything else (addAll is all-or-nothing).
      Promise.allSettled(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('SW precache failed for', url, err);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          // Only cache successful responses.
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => null);

      // Cache-first: serve cached copy immediately if we have one.
      if (cached) return cached;

      // No cache entry: wait for network, and only fall back to a
      // synthetic error response if that also fails, so we never
      // resolve with `undefined` (which breaks the fetch entirely).
      return networkFetch.then(
        (response) => response || new Response('Offline and not cached', { status: 504, statusText: 'Offline' })
      );
    })
  );
});
