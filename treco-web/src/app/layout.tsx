import { AuthProvider } from "@/lib/auth";
import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { PropsWithChildren } from "react";
import "./globals.css";

const baseFont = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["300", "700", "900"],
});

export const metadata: Metadata = {
  title: "TRECo - BESIDE YOUR WORKOUT",
  description:
    "トレーニングをもっと楽しくするシンプルなトレーニング記録サービス",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
