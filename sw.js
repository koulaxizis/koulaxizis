// sw.js - Διορθωμένη έκδοση με ασφάλεια promises
const CACHE_NAME = 'koulaxizis-v43'; // Αύξηση έκδοσης σε κάθε αλλαγή cached αρχείων
const urlsToCache = [
  '/',
  '/index.html',
  // Same URLs (with ?v=) as the pages request them, so offline matches work.
  '/style.css?v=3.52',
  '/script.js?v=3.52',
  '/assets/fonts/ubuntu-mono/ubuntu-mono.css?v=3.52',
  '/assets/icons.svg?v=3.52',
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
        // cache: 'reload' skips the browser's HTTP cache, so the new version is stored, not an old copy.
        return cache.addAll(urlsToCache.map((url) => new Request(url, { cache: 'reload' })));
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
    }).then(() => self.clients.claim())
  );
});

// Fetch events
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Same origin only: requests to other sites (e.g. the GitHub API from admin.html)
  // go straight to the network and are never cached here.
  if (requestUrl.origin !== self.location.origin) return;

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
            return cachedResponse || new Response('', { status: 503, statusText: 'Offline' });
          });
        })
    );
    return;
  }

  // --- CSS, JS, SVG and the manifest: Network First, falling back to cache ---
  // These change together with the HTML. Serving them from cache while the HTML
  // came from the network showed new markup with an old style.css or icon sprite
  // (V3.51: every SVG icon huge and black on the first visit after an update).
  if (/\.(css|js|svg|webmanifest)$/.test(requestUrl.pathname) ||
      requestUrl.pathname === '/manifest.json') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || new Response('', { status: 503, statusText: 'Offline' });
          });
        })
    );
    return;
  }

  // --- Images and fonts: Cache First with Background Update ---
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