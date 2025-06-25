// app/layout.tsx

import '@mantine/core/styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import Script from 'next/script';
import { Funnel_Display, Open_Sans } from 'next/font/google';

const fontHeaders = Funnel_Display({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
});

const fontBody = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Hikedex - adventure travel companion',
  description: 'Find all the amenities you need for any adventure, anywhere in the world. Backpacking, hiking, wild camping, vanlife, or just a day out, hikedex has your back.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <style>{`
          body {
            font-family: ${fontBody.style.fontFamily}, sans-serif;
          }
          .mantine-Drawer-title {
            font-family: ${fontHeaders.style.fontFamily}, sans-serif;
            font-size: 1.2rem;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: ${fontHeaders.style.fontFamily}, sans-serif;
          }
        `}</style>
      </head>
      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
