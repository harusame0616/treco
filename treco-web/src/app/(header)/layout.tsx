import { PropsWithChildren } from 'react';
import Icon from './icon.png';
import Image from 'next/image';
import Link from 'next/link';

// ...

<Image src={Icon} alt="TRECo アイコン" width={100} height={100} />;

export default function HeaderLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full h-full">
      <header className="fixed pt-2 px-4 w-full bg-background">
        <div className="flex max-w-5xl mx-auto">
          <Link href="/">
            <div className="sr-only">TRECo ホームへのリンク</div>
            <Image src={Icon} alt="TRECo アイコン" width="32" height="32" />
          </Link>
        </div>
      </header>
      <div className="py-12 h-full">{children}</div>
    </div>
  );
}
