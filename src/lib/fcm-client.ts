'use client';

/**
 * Typhoon Solar - Client-side FCM Push Notification Handler
 * Manages notification permission, token generation, and backend registration.
 */

export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.log('[FCM] Notifications not supported in this browser environment');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[FCM] Notification permission denied by user');
      return null;
    }

    // Register service worker if not already registered
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('[FCM] Service worker active:', registration.scope);

    // Dynamic import to keep bundle lightweight
    const { initializeApp, getApps } = await import('firebase/app');
    const { getMessaging, getToken } = await import('firebase/messaging');

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const messaging = getMessaging(app);

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey,
    });

    if (token) {
      console.log('[FCM] Device Token obtained:', token.slice(0, 15) + '...');
      // Sync token with backend
      await syncTokenWithBackend(token);
      return token;
    }

    return null;
  } catch (error) {
    console.warn('[FCM] Error requesting notification token:', error);
    return null;
  }
}

async function syncTokenWithBackend(fcmToken: string) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    await fetch('/api/v1/auth/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fcmToken }),
    });
    console.log('[FCM] Device token registered with backend');
  } catch (err) {
    console.error('[FCM] Failed to sync token with backend:', err);
  }
}

