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
  title: 'Hikedex – backpacking, wild camping, vanlife, and travel maps',
  description: 'Everything you need for any adventure, anywhere in the world. Instantly find parking, water, toilets, food stops, and more along your route. Print them all onto a single map or save offline.',
  keywords: [
    'wild camping',
    'vanlife',
    'backpacking',
    'printable maps',
    'travel maps',
    'free camping',
    'road trip',
    'overlanding',
    'outdoor travel',
    'global map',
    'camping app',
    'travel amenities',
    'campervan',
    'hiking',
    'adventure travel',
    'find parking',
    'drinking water',
    'public toilets',
    'groceries',
    'hikedex'
  ].join(', '),
  openGraph: {
    title: 'Hikedex – backpacking, wild camping, vanlife, and travel maps',
    description: 'Everything you need for any adventure, anywhere in the world. Instantly find parking, water, toilets, food stops, and more along your route. Print them all onto a single map or save offline.',
    url: 'https://hikedex.app/',
    siteName: 'Hikedex',
    images: [
      {
        url: 'https://hikedex.app/logo.svg',
        width: 512,
        height: 512,
        alt: 'Hikedex Logo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hikedex – backpacking, wild camping, vanlife, and travel maps',
    description: 'Everything you need for any adventure, anywhere in the world. Instantly find parking, water, toilets, food stops, and more along your route. Print them all onto a single map or save offline.',
    site: '@hikedex',
    images: ['https://hikedex.app/logo.svg'],
  },
  metadataBase: new URL('https://hikedex.app'),
  alternates: {
    canonical: '/',
  },
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
        <link rel="canonical" href="https://hikedex.app/" />
        <meta property="og:url" content="https://hikedex.app/" />
        <meta property="og:image" content="https://hikedex.app/logo.svg" />
        <meta name="twitter:image" content="https://hikedex.app/logo.svg" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Hikedex",
            "url": "https://hikedex.app/",
            "description": "Everything you need for any adventure, anywhere in the world. Instantly find parking, water, toilets, food stops, and more along your route. Print them all onto a single map or save offline.",
            "applicationCategory": "TravelApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "keywords": [
              "wild camping",
              "vanlife",
              "backpacking",
              "printable maps",
              "travel maps",
              "free camping",
              "road trip",
              "overlanding",
              "outdoor travel",
              "global map",
              "camping app",
              "travel amenities",
              "campervan",
              "hiking",
              "adventure travel",
              "find parking",
              "drinking water",
              "public toilets",
              "groceries",
              "hikedex"
            ]
          }
        `}</script>
      </head>
      <body>
        <MantineProvider theme={
          {
            fontFamily: fontBody.style.fontFamily,
            headings: { fontFamily: fontHeaders.style.fontFamily },
            black: '#352f36',
          }
        }>
          {children}
        </MantineProvider>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
