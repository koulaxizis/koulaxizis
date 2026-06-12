// sw.js - Updated with better caching strategies and cache busting for dynamic content
const CACHE_NAME = 'koulaxizis-v5'; // Incremented version from v4 → v5
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icon-192.webp',
  '/icon-512.webp',
  '/manifest.json',
  '/avatar.webp',
  '/robots.txt',
  '/sitemap.xml'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  ).then(() => self.clients.claim()); // Take control of pages immediately
});

// Fetch events - Στρατηγική ανάλογα με τον τύπο αρχείου
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // --- NETWORK FIRST με Fallback για HTML (Συχνά αλλάζει) ---
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
          // Fallback στο cache αν δεν υπάρχει δίκτυο ή σφάλμα 404
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || new Response('Offline - Η σελίδα δεν είναι διαθέσιμη', { status: 503 });
          });
        })
    );
    return;
  }

  // --- NETWORK FIRST με Cache Update + Cache Bust για JSON/XML (Updates/Feed) ---
  if (requestUrl.pathname.endsWith('.json') || 
      requestUrl.pathname.endsWith('.xml')) {
    
    // ✅ CACHE BUSTING: Προσθήκη timestamp αν δεν υπάρχει
    const url = new URL(event.request.url);
    if (!url.searchParams.has('t')) {
      url.searchParams.set('t', Date.now());
    }
    
    event.respondWith(
      fetch(url.toString(), { 
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
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
          // Fallback στο cache αν το network failάρει
          return caches.match(event.request);
        })
    );
    return;
  }

  // --- CACHE FIRST με Background Update για Στατικά (CSS, JS, Images) ---
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // Return cached immediately, then update in background
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          }).catch(() => {}); // Ignore errors silently
          return response;
        }
        
        // If not in cache, fetch and cache
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