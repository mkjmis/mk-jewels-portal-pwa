// Simple cache for the PWA shell itself (index + manifest + icons)
const CACHE_NAME = "mkjewels-portal-shell-v1";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-512.png",
  "./icon-192.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => (k === CACHE_NAME ? null : caches.delete(k)))
      )
    )
  );
  self.clients.claim();
});

// For shell files, serve from cache first (fast install experience)
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Only handle this origin
  if (url.origin !== self.location.origin) return;

  if (SHELL_FILES.some(path => url.pathname.endsWith(path.replace("./", "/")))) {
    event.respondWith(
      caches.match(event.request).then(resp => resp || fetch(event.request))
    );
  }
});
