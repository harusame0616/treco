import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

import Icon from './icon.png';
import { Title } from './title';

<Image alt="TRECo アイコン" height={100} src={Icon} width={100} />;

export default function HeaderLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col border-x border-x-accent">
      <MainHeader />
      <div className="grow overflow-hidden">{children}</div>
    </div>
  );
}

function MainHeader() {
  return (
    <header className="grid grid-cols-header items-center border-b border-b-accent bg-background px-4 py-2 shadow-md">
      <Link href="/">
        <div className="sr-only">TRECo ホームへのリンク</div>
        <Image alt="TRECo アイコン" height="32" src={Icon} width="32" />
      </Link>
      <Title />
      <div></div>
    </header>
  );
}
