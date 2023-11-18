var cacheName = 'my-portofolio';
var filesToCache = [
  '/home.html',
  '/index.html',
  '/about.html',
  '/skill.html',
  '/contact.html',
  '/img/bangozanx.png',
  '/css/styles.css',
  '/js/main.js',
  '/js/typed.js',
  '/js/jquery.easing.min.js',
  '/js/jquery-2.2.4.min.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

console.log("new sw");
