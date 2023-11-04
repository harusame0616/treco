import { isAuthenticated } from '@/lib/auth/auth';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LoginButtonList } from '../login-button-list';
import QRCode from './qr.png';
import SplashImage from './splash.svg';

export default async function Home() {
  if (await isAuthenticated()) {
    redirect('/home');
  }

  return (
    <main className="flex w-full flex-col items-center gap-10 px-4 py-14">
      <Image
        alt="TRECo BESIDE YOUR WORKOUT"
        priority
        src={SplashImage}
        width="500"
      />
      <p className="flex flex-col gap-2 text-center text-[min(5vw,28px)]">
        <span className="block">トレーニングをもっと楽しくする</span>
        <span className="block">シンプルなトレーニング記録サービス</span>
      </p>
      <LoginButtonList />
      <p className="text-xs">
        <Link href="/policies/term-of-service">利用規約</Link>、
        <Link href="/policies/privacy-policy">プライバシーポリシー</Link>
        に同意の上ご利用ください。
      </p>
      <section className="flex flex-col items-center text-xs">
        <p className="mb-4">
          本サービスはモバイル端末向けに最適化されています。
          <br />
          以下のQRコードからモバイル端末でご利用ください。
        </p>
        <Image
          alt="trec.fit へのリンクの QR Code 画像"
          className="h-20 w-20"
          src={QRCode}
        />
      </section>
    </main>
  );
}
