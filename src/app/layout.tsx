import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { PwaRegister } from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: 'Typhoon Solar - Team App',
  description: 'Solar Rooftop ERP, CRM & Lifecycle Management Platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Typhoon Solar',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B192C',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-typhoon-sand min-h-screen">
        <PwaRegister />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#0B192C',
              color: '#FFFFFF',
              border: '1px solid rgba(245, 166, 35, 0.3)',
            },
          }}
        />
      </body>
    </html>
  );
}

