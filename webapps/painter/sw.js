// importScripts(
//   "https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js"
// );

var cacheStorageKey = "painter_cache";
var cacheList = [
  "/",
  "./static/icon.png",
  "index.html",
  "./libs/jquery-1.10.1.min.js",
  "./libs/simple-undo.js",
  "./libs/drawingboard/drawingboard.min.css",
  "./libs/drawingboard/drawingboard.min.js"
];
self.addEventListener("install", e => {
  e.waitUntil(
    caches
      .open(cacheStorageKey)
      .then(cache => cache.addAll(cacheList))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response != null) {
        return response;
      }
      return fetch(e.request.url);
    })
  );
});
self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheNames => {
              return cacheNames !== cacheStorageKey;
            })
            .map(cacheNames => {
              return caches.delete(cacheNames);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});
