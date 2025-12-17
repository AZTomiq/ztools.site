const CACHE_NAME = 'ztools-v6';
const STATIC_ASSETS = [
'./',
'./manifest.json',
'./assets/css/global.css',
'./assets/js/global.js',

  './vi/',
 './vi/index.html',
 './en/',
 './en/index.html',
 './assets/features/bmi/style.css',
 './assets/features/bmi/script.js',
 './vi/bmi/',
 './en/bmi/',
 './assets/features/business-tax/style.css',
 './assets/features/business-tax/script.js',
 './vi/business-tax/',
 './en/business-tax/',
 './assets/features/compound-interest/style.css',
 './assets/features/compound-interest/script.js',
 './vi/compound-interest/',
 './en/compound-interest/',
 './assets/features/json-toolkit/style.css',
 './assets/features/json-toolkit/script.js',
 './vi/json-toolkit/',
 './en/json-toolkit/',
 './assets/features/loan-calculator/style.css',
 './assets/features/loan-calculator/script.js',
 './vi/loan-calculator/',
 './en/loan-calculator/',
 './assets/features/lorem-ipsum/style.css',
 './assets/features/lorem-ipsum/script.js',
 './vi/lorem-ipsum/',
 './en/lorem-ipsum/',
 './assets/features/password-generator/style.css',
 './assets/features/password-generator/script.js',
 './vi/password-generator/',
 './en/password-generator/',
 './assets/features/percentage-calculator/style.css',
 './assets/features/percentage-calculator/script.js',
 './vi/percentage-calculator/',
 './en/percentage-calculator/',
 './assets/features/savings-interest/style.css',
 './assets/features/savings-interest/script.js',
 './vi/savings-interest/',
 './en/savings-interest/',
 './assets/features/social-insurance/style.css',
 './assets/features/social-insurance/script.js',
 './vi/social-insurance/',
 './en/social-insurance/',
 './assets/features/tax/style.css',
 './assets/features/tax/script.js',
 './vi/tax/',
 './en/tax/',
 './assets/features/uuid-generator/style.css',
 './assets/features/uuid-generator/script.js',
 './vi/uuid-generator/',
 './en/uuid-generator/',
 './assets/features/word-counter/style.css',
 './assets/features/word-counter/script.js',
 './vi/word-counter/',
 './en/word-counter/'
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