import type { Metadata } from 'next';
import './globals.css';
import { Agentation } from 'agentation';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export const metadata: Metadata = {
  title: 'BrandSprint',
  description: 'Have one conversation and walk away with a complete brand kit your AI tools can actually use.',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'BrandSprint',
    description: 'Have one conversation and walk away with a complete brand kit your AI tools can actually use.',
    url: 'https://brandsprint.app',
    siteName: 'BrandSprint',
    images: [
      {
        url: 'https://brandsprint.app/og-image.jpg',
        width: 4072,
        height: 2160,
        alt: 'BrandSprint',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrandSprint',
    description: 'Have one conversation and walk away with a complete brand kit your AI tools can actually use.',
    images: ['https://brandsprint.app/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body>
          {children}
          {process.env.NODE_ENV === 'development' && <Agentation />}
        </body>
      </html>
    </ClerkProvider>
  );
}
