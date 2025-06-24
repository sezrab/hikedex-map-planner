// app/layout.tsx

import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

export const metadata = {
  title: 'Hikedex - adventure travel companion',
  description: 'Find all the amenities you need for any adventure, anywhere in the world. Backpacking, hiking, wild camping, vanlife, or just a day out, hikedex has your back.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
