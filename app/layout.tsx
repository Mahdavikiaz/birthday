import type { Metadata, Viewport } from 'next';

import birthdayConfig from '@/config/birthday';

import './globals.css';

export const metadata: Metadata = {
  title: birthdayConfig.meta.title,
  description: birthdayConfig.meta.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#08090D',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
