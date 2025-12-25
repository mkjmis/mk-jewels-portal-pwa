const CACHE_NAME = 'mkjewels-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        '/', '/index.html', '/manifest.json'
        // add icons etc…
      ])
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
});

// Never cache Apps Script API responses
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin === 'https://script.google.com') {
    // let network handle it directly
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res =>
      res || fetch(event.request)
    )
  );
});
