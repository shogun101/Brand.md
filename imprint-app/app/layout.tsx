import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
