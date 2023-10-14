import { Button } from "@/components/ui/button";
import { FilePlusIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, ReactElement } from "react";

import Icon from "./icon.png";
import { Title } from "./title";

<Image alt="TRECo アイコン" height={100} src={Icon} width={100} />;

export default function HeaderLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full h-full flex flex-col max-w-5xl mx-auto border-x border-x-accent">
      <MainHeader />
      <div className="grow overflow-hidden">{children}</div>
    </div>
  );
}

function MainHeader() {
  return (
    <header className="px-4 py-2 bg-background items-center grid border-b border-b-accent shadow-md grid-cols-header">
      <Link href="/">
        <div className="sr-only">TRECo ホームへのリンク</div>
        <Image alt="TRECo アイコン" height="32" src={Icon} width="32" />
      </Link>
      <Title />
      <div></div>
    </header>
  );
}
