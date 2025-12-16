const CACHE_NAME = 'ztools-v6';
const STATIC_ASSETS = [
  './vi/',
  './vi/index.html',
  './manifest.json',
  './assets/css/global.css',
  './assets/js/global.js',
  './vi/tax/',
  './vi/bmi/',
  './vi/json-formatter/',
  './vi/loan-calculator/',
  './vi/business-tax/',
  './vi/social-insurance/',
  './vi/word-counter/',
  './vi/lorem-ipsum/',
  './vi/password-generator/',
  './vi/uuid-generator/'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (e) => {
  console.log('[SW] Installing...');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching App Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean old caches
self.addEventListener('activate', (e) => {
  console.log('[SW] Activating...');
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch Event: Strategy - Stale While Revalidate
self.addEventListener('fetch', (e) => {
  // Skip non-GET and external requests
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(e.request);

      // Fetch logic
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        // Update cache with new version
        if (networkResponse.ok) {
          cache.put(e.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch((err) => {
        // Network failed
        console.warn('[SW] Network fail:', err);
      });

      // Return cached response immediately if available, else wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
