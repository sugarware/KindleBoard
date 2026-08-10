const CACHE_NAME = 'sleeping-kindle-v0.8b';

const LOCAL_ASSETS = [
  "./",
  "./index.html",
  "./manifest-v0.8b.webmanifest",
  "./jszip.min.js",
  "./icons/icon-192-v0.8b.png",
  "./icons/icon-512-v0.8b.png",
  "./icons/icon-512-maskable-v0.8b.png",
  "./icons/apple-touch-icon-v0.8b.png",
  "./icons/favicon-32-v0.8b.png",
  "./icons/favicon-16-v0.8b.png"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(LOCAL_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => {
    const networkFetch = fetch(event.request).then(response => {
      if (response && (response.ok || response.type === 'opaque')) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request,copy)); }
      return response;
    });
    if (event.request.mode === 'navigate') return networkFetch.catch(() => cached || caches.match('./index.html'));
    return cached || networkFetch;
  }));
});
