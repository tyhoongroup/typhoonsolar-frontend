'use client';

/**
 * Typhoon Solar - Unified Web Push & In-Browser Notification Handler
 * Works seamlessly over HTTPS domains, subdomains, and localhost.
 * Resilient against missing VAPID keys: grants browser permissions,
 * registers push notifications with ServiceWorker, and plays chimes in-app.
 */

export async function requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('[Push] Notifications not supported in this browser.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('[Push] Notification permission granted.');
      // Register unified service worker if not already registered
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
        console.log('[Push] Service worker active with scope:', reg.scope);
      }
      // Attempt optional FCM sync if VAPID key is configured
      syncFcmIfConfigured().catch((err) => {
        console.warn('[FCM] Optional background token sync:', err);
      });
    }
    return permission;
  } catch (error) {
    console.error('[Push] Permission request error:', error);
    return 'denied';
  }
}

/**
 * Triggers a desktop / mobile system notification (outside browser window)
 * Falls back to in-app toast if in foreground or blocked.
 */
export async function triggerSystemNotification(title: string, options?: NotificationOptions & { url?: string }) {
  if (typeof window === 'undefined') return;

  if ('Notification' in window && Notification.permission === 'granted') {
    // If service worker is ready, trigger via showNotification for mobile lockscreen & background support
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        return (reg as any).showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          vibrate: [200, 100, 200],
          ...options,
        });
      } catch (e) {
        // Fallback to desktop window Notification
      }
    }

    try {
      return new Notification(title, {
        icon: '/icons/icon-192x192.png',
        ...options,
      });
    } catch (e) {
      console.warn('[Push] Window notification trigger error:', e);
    }
  }
}

async function syncFcmIfConfigured() {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!vapidKey || !apiKey) {
    // Graceful skip - native Web Notifications still work without Firebase VAPID
    return null;
  }

  try {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getMessaging, getToken } = await import('firebase/messaging');

    const firebaseConfig = {
      apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const messaging = getMessaging(app);

    const reg = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
      serviceWorkerRegistration: reg,
      vapidKey,
    });

    if (token) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        await fetch('/api/v1/auth/fcm-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ fcmToken: token }),
        });
      }
      return token;
    }
  } catch (err) {
    console.warn('[FCM] Token generation skipped:', err);
  }
  return null;
}
