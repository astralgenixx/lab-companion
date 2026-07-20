/* Lab Companion Service Worker — offline support + caching */
const CACHE = 'lab-companion-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/data/data.js',
  './js/app.js',
  './js/views/dashboard.js',
  './js/views/timers.js',
  './js/views/clock.js',
  './js/views/calculators.js',
  './js/views/western.js',
  './js/views/gel.js',
  './js/views/cellculture.js',
  './js/views/icc.js',
  './js/views/pcr.js',
  './js/views/recipes.js',
  './js/views/celllines.js',
  './js/views/inventory.js',
  './js/views/notebook.js',
  './js/views/tasks.js',
  './js/views/settings.js',
  './js/views/drugs.js',
  './js/views/protocols.js',
  './js/views/growth.js',
  './js/views/transfection.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('SW: some assets unavailable (will cache on access):', err.message);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => {
    return Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.startsWith('chrome-extension://')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
