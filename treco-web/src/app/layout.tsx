import type { Metadata } from 'next';

import { AuthProvider } from '@/lib/auth';
import { M_PLUS_Rounded_1c } from 'next/font/google';
import { PropsWithChildren } from 'react';

import './globals.css';

const baseFont = M_PLUS_Rounded_1c({
  subsets: ['latin'],
  weight: ['300', '700', '900'],
});

export const metadata: Metadata = {
  description:
    'トレーニングをもっと楽しくするシンプルなトレーニング記録サービス',
  title: 'TRECo - BESIDE YOUR WORKOUT',
  viewport: {
    initialScale: 1,
    maximumScale: 1,
    width: 'device-width',
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ja">
      <body className={`${baseFont.className} dark`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
