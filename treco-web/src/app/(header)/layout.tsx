import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

import Icon from './icon.png';
import { Title } from './title';

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
    <header className="grid grid-cols-header items-center border-b border-b-accent bg-background px-4 py-1 shadow-md">
      <Link href="/">
        <Image alt="TRECo" height="32" src={Icon} width="32" />
      </Link>
      <Title />
      <div></div>
    </header>
  );
}
