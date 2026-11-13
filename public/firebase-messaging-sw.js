// Typhoon Solar - Firebase Cloud Messaging Background Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDFktI-DSwlV0uLstyUJTKeYva-2o2RSus",
  authDomain: "typhoon-solar-f2cb5.firebaseapp.com",
  projectId: "typhoon-solar-f2cb5",
  storageBucket: "typhoon-solar-f2cb5.firebasestorage.app",
  messagingSenderId: "637945753608",
  appId: "1:637945753608:web:c01364779aa75da72821bd"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background notification received:', payload);

  const title = payload.notification?.title || 'Typhoon Solar Alert';
  const options = {
    body: payload.notification?.body || 'New operational update received',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || '/dashboard'
    }
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
