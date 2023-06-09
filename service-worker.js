const cacheName = "calc";

const cacheAssets = [
  "/",
  "./index.html",
  "./cal.css",
  "./cal.js",
  "./icons/icon_192.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const resClone = res.clone();
          caches.open(cacheName).then((cache) => {
            cache.put(e.request, resClone);
          });
          return res;
        })
        .catch(() =>
          caches.match(e.request).then((res) => {
            if (res) {
              return res;
            } else {
              return fetch(e.request);
            }
          })
        )
    );
  }
});
