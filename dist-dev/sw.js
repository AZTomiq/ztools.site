const CACHE_NAME = 'ztools-v7';
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
        './assets/features/bookmark-creator/style.css',
        './assets/features/bookmark-creator/script.js',
        './vi/bookmark-creator/',
        './en/bookmark-creator/',
        './assets/features/business-tax/style.css',
        './assets/features/business-tax/script.js',
        './vi/business-tax/',
        './en/business-tax/',
        './assets/features/compound-interest/style.css',
        './assets/features/compound-interest/script.js',
        './vi/compound-interest/',
        './en/compound-interest/',
        './assets/features/forex-gold/style.css',
        './assets/features/forex-gold/script.js',
        './vi/forex-gold/',
        './en/forex-gold/',
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
        './assets/features/lunar-calendar/style.css',
        './assets/features/lunar-calendar/script.js',
        './vi/lunar-calendar/',
        './en/lunar-calendar/',
        './assets/features/password-generator/style.css',
        './assets/features/password-generator/script.js',
        './vi/password-generator/',
        './en/password-generator/',
        './assets/features/percentage-calculator/style.css',
        './assets/features/percentage-calculator/script.js',
        './vi/percentage-calculator/',
        './en/percentage-calculator/',
        './assets/features/random-toolkit/style.css',
        './assets/features/random-toolkit/script.js',
        './vi/random-toolkit/',
        './en/random-toolkit/',
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
        './assets/features/text-diff/style.css',
        './assets/features/text-diff/script.js',
        './vi/text-diff/',
        './en/text-diff/',
        './assets/features/text-formatter/style.css',
        './assets/features/text-formatter/script.js',
        './vi/text-formatter/',
        './en/text-formatter/',
        './assets/features/timestamp-converter/style.css',
        './assets/features/timestamp-converter/script.js',
        './vi/timestamp-converter/',
        './en/timestamp-converter/',
        './assets/features/unit-converter/style.css',
        './assets/features/unit-converter/script.js',
        './vi/unit-converter/',
        './en/unit-converter/',
        './assets/features/url-toolkit/style.css',
        './assets/features/url-toolkit/script.js',
        './vi/url-toolkit/',
        './en/url-toolkit/',
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
        if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
        return;
        }

        e.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(e.request);
        const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse.ok) {
        cache.put(e.request, networkResponse.clone());
        }
        return networkResponse;
        }).catch((err) => {
        console.warn('[SW] Network fail:', err);
        });
        return cachedResponse || fetchPromise;
        })
        );
        });