// sw.js
const CACHE_NAME = 'koulaxizis-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icon-192.webp',
  '/icon-512.webp',
  '/manifest.json',
  '/avatar.webp'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch events - Στρατηγική ανάλογα με τον τύπο αρχείου
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // --- NETWORK FIRST για HTML (πάντα η τελευταία εκδοχή) ---
  if (requestUrl.pathname.endsWith('/') || 
      requestUrl.pathname.endsWith('.html') || 
      requestUrl.pathname === '/') {
    
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback στο cache αν δεν υπάρχει δίκτυο
          return caches.match(event.request);
        })
    );
    return;
  }

  // --- NETWORK FIRST για JSON (updates.json, feed.xml) ---
  if (requestUrl.pathname.endsWith('.json') || 
      requestUrl.pathname.endsWith('.xml')) {
    
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // --- CACHE FIRST για στατικά αρχεία (CSS, JS, images) ---
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // Ενημέρωση cache στο background (stale-while-revalidate)
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {});
          return response;
        }
        
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
  );
});