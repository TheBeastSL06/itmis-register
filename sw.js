// ITMIS Register — Service Worker (online-first, installable)
const CACHE_NAME = 'itmis-register-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Online-first: try network, fall back to cache for shell files only
self.addEventListener('fetch', e => {
  // Never intercept Apps Script calls
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
