import Image from 'next/image';
import SplashImage from './splash.svg';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col w-full items-center px-4 py-14 gap-10">
      <Image
        priority
        src={SplashImage}
        alt="TRECo BESIDE YOUR WORKOUT"
        width="500"
      />
      <p className="text-[min(5vw,28px)] text-center flex flex-col gap-2">
        <span className="block">トレーニングをもっと楽しくする</span>
        <span className="block">シンプルなトレーニング記録サービス</span>
      </p>
      <div className="flex flex-col gap-2">
        <Button>Google でログイン</Button>
        <Button>Twitter でログイン</Button>
        <Button>Facebook でログイン</Button>
        <Button variant="ghost" className="text-primary">
          登録せず開始する
        </Button>
      </div>
      <div className="text-xs">
        <Link href="/policies/term-of-service">利用規約</Link>、
        <Link href="/policies/privacy-policy">プライバシーポリシー</Link>
        に同意の上ご利用ください。
      </div>
    </main>
  );
}
