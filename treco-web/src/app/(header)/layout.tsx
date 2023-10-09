import { PropsWithChildren, ReactElement } from 'react';
import Icon from './icon.png';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilePlusIcon, HomeIcon, PersonIcon } from '@radix-ui/react-icons';
import { Title } from './title';

<Image src={Icon} alt="TRECo アイコン" width={100} height={100} />;

export default function HeaderLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full h-full flex flex-col max-w-5xl mx-auto border-x border-x-accent">
      <MainHeader />
      <div className="grow">{children}</div>
    </div>
  );
}

function MainHeader() {
  return (
    <header className="px-4 py-2 bg-background items-center grid border-b border-b-accent shadow-md grid-cols-header">
      <Link href="/">
        <div className="sr-only">TRECo ホームへのリンク</div>
        <Image src={Icon} alt="TRECo アイコン" width="32" height="32" />
      </Link>
      <Title />
      <div></div>
    </header>
  );
}
