import './globals.css';
import type { Metadata } from 'next';
import { M_PLUS_Rounded_1c } from 'next/font/google';

const baseFont = M_PLUS_Rounded_1c({
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'TRECo - BESIDE YOUR WORKOUT',
  description:
    'トレーニングをもっと楽しくするシンプルなトレーニング記録サービス',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${baseFont.className} dark`}>{children}</body>
    </html>
  );
}
