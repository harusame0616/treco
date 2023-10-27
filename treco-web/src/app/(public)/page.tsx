import { isAuthenticated } from '@/lib/auth/auth';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LoginButtonList } from '../login-button-list';
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
      <div className="flex flex-col gap-2">
        <LoginButtonList />
      </div>
      <div className="text-xs">
        <Link href="/policies/term-of-service">利用規約</Link>、
        <Link href="/policies/privacy-policy">プライバシーポリシー</Link>
        に同意の上ご利用ください。
      </div>
    </main>
  );
}
