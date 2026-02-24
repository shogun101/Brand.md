import type { Metadata } from 'next';
import './globals.css';
import { Agentation } from 'agentation';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export const metadata: Metadata = {
  title: 'Imprint — Build Your Brand, Out Loud',
  description: 'Voice-based brand strategy tool. Have a conversation and walk away with structured brand files.',
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
