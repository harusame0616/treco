import type { Metadata, Viewport } from 'next';

import { M_PLUS_Rounded_1c } from 'next/font/google';
import { PropsWithChildren } from 'react';

import './globals.css';
import { SessionProvider } from './session-provider';

const baseFont = M_PLUS_Rounded_1c({
  subsets: ['latin'],
  weight: ['300', '700', '900'],
});

export const metadata: Metadata = {
  description:
    'トレーニングをもっと楽しくするシンプルなトレーニング記録サービス',
  title: {
    default: 'TRECo -BESIDE YOUR WORKOUT-',
    template: '%s | TRECo',
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ja">
      <body className={`${baseFont.className} dark`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
