import { isAuthenticated } from '@/lib/auth/auth';
import { HomeIcon, FilePlusIcon, PersonIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function AuthLayout({ children }: PropsWithChildren) {
  if (await isAuthenticated()) {
    return (
      <div className="flex flex-col h-full">
        <main className="overflow-scroll grow">{children}</main>
        <MainMenu />
      </div>
    );
  }

  redirect('/');
}

function MainMenu() {
  const menus = [
    {
      label: 'ホーム',
      icon: HomeIcon,
      path: '/home',
    },
    {
      label: 'トレーニング記録',
      icon: FilePlusIcon,
      path: '/home/categories',
    },
    {
      label: 'アカウント',
      icon: PersonIcon,
      path: '/home/account',
    },
  ];
  return (
    <nav
      className="border-t-accent border-t px-4 py-2 bg-background"
      aria-label="メインメニュー"
    >
      <ul className="flex justify-evenly" aria-label="メニュー">
        {menus.map((menu) => (
          <MenuItem {...menu} key={menu.path} />
        ))}
      </ul>
    </nav>
  );
}

function MenuItem({
  label,
  icon: Icon,
  path,
}: {
  label: string;
  icon: React.ElementType;
  path: string;
}) {
  return (
    <li aria-label={label} key={path}>
      <Link href={path} aria-label={`${label}へのリンク`}>
        <Icon className="w-8 h-8" aria-hidden />
      </Link>
    </li>
  );
}
