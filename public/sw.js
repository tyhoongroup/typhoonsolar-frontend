// Typhoon Solar - Unified Service Worker (PWA Offline Caching + WebAPK + Background Push)
const CACHE_NAME = 'typhoon-pwa-v4';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/images/typhoon-logo.png',
  '/images/typhoon-logo.webp',
];

// 1. Install Event: Cache Shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    })
  );
});

// 2. Activate Event: Claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) return caches.delete(key);
          })
        )
      ),
    ])
  );
});

// 3. Fetch Event: Standard WebAPK fetch handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass API requests to ensure fresh operational data
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Network first for HTML navigation so users get latest updates, fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Cache-first for static icons, images, and static assets
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
        );
      })
    );
    return;
  }
});

// 4. Push Event: Android system notification
self.addEventListener('push', (event) => {
  let data = {};
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    data = { title: 'Typhoon Solar', body: event.data ? event.data.text() : 'Operational update received' };
  }

  const title = data.title || data.notification?.title || 'Typhoon Solar Alert';
  const options = {
    body: data.body || data.notification?.body || 'New operational update received',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || data.data?.url || '/dashboard',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 5. Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url && client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
