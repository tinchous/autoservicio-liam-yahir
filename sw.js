// sw.js - caching simple
const CACHE_NAME = "liamyahir-v1";
const ASSETS = [
  "/index.html", "/products.html", "/css/neon.css", "/css/style.css", "/js/main.js", "/images/logo.png"
];

self.addEventListener("install", evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", evt => evt.waitUntil(self.clients.claim()));
self.addEventListener("fetch", evt => {
  if (evt.request.method !== "GET") return;
  const url = new URL(evt.request.url);
  if (url.origin === location.origin && url.pathname.startsWith("/images/")) {
    evt.respondWith(caches.match(evt.request).then(r => r || fetch(evt.request).then(resp => { caches.open(CACHE_NAME).then(c => c.put(evt.request, resp.clone())); return resp; })));
  } else {
    evt.respondWith(fetch(evt.request).catch(()=> caches.match(evt.request)));
  }
});
