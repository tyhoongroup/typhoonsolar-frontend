'use client';

import { useEffect } from 'react';
import { PwaInstallModal } from './PwaInstallModal';

export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch((err) => console.log('PWA ServiceWorker registration:', err));
      });
    }
  }, []);

  return <PwaInstallModal />;
}

