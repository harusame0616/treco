'use client';

import { FilePlusIcon, HomeIcon, PersonIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function MainMenu() {
  const searchParams = useSearchParams();
  const selectedDate = dayjs(searchParams.get('date') || new Date());

  const menus = [
    {
      icon: HomeIcon,
      label: 'ホーム',
      path: '/home',
    },
    {
      icon: FilePlusIcon,
      label: 'トレーニング記録',
      path: `/home/categories?date=${selectedDate.toISOString()}`,
    },
    {
      icon: PersonIcon,
      label: 'アカウント',
      path: '/home/account',
    },
  ];

  return (
    <nav
      aria-label="メインメニュー"
      className="border-t-accent border-t px-4 py-2 bg-background"
    >
      <ul aria-label="メニュー" className="flex justify-evenly">
        {menus.map((menu) => (
          <MenuItem {...menu} key={menu.path} />
        ))}
      </ul>
    </nav>
  );
}

function MenuItem({
  icon: Icon,
  label,
  path,
}: {
  icon: React.ElementType;
  label: string;
  path: string;
}) {
  return (
    <li aria-label={label} key={path}>
      <Link aria-label={`${label}へのリンク`} href={path}>
        <Icon aria-hidden className="w-8 h-8" />
      </Link>
    </li>
  );
}
