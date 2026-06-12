// sw.js - Διορθωμένη έκδοση με ασφάλεια promises
const CACHE_NAME = 'koulaxizis-v6'; // Έκανα αύξηση στην έκδοση (v5 -> v6) για να αναγκάσω refresh
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
      .then(() => self.skipWaiting())
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
  ).then(() => self.clients.claim());
});

// Fetch events
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // --- HTML Files: Network First, falling back to cache ---
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
        .catch((error) => {
          console.log('[SW] Network failed for HTML, trying cache:', error);
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || new Response('Offline - Η σελίδα δεν είναι διαθέσιμη', { status: 503 });
          });
        })
    );
    return;
  }

  // --- JSON/XML Files: Cache Busting + Network First ---
  if (requestUrl.pathname.endsWith('.json') || 
      requestUrl.pathname.endsWith('.xml')) {
    
    const url = new URL(event.request.url);
    // Προσθήκη timestamp για cache busting
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
          if (networkResponse && networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((error) => {
          console.log('[SW] Network failed for JSON/XML, trying cache:', error);
          // Fallback στο cache αν το network failάρει
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || null; // Επιστρέφουμε null αν δεν βρεθεί τίποτα
          });
        })
    );
    return;
  }

  // --- Static Assets (CSS, JS, Images): Cache First with Background Update ---
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached immediately, then update in background
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          }).catch(() => {}); // Ignore errors silently
          return cachedResponse;
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
        }).catch(() => {
           // Αν δεν υπάρχει ούτε cache και δεν υπάρχει δίκτυο, μην ρίξεις error
           return new Response("Not found", { status: 404 });
        });
      })
  );
});