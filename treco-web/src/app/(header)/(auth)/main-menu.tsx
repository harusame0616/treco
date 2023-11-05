'use client';

import { createTZDate } from '@/lib/date';
import { FilePlusIcon, HomeIcon, PersonIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function MainMenu() {
  const searchParams = useSearchParams();
  const selectedDate = createTZDate(searchParams.get('date'));

  const menus = [
    {
      icon: HomeIcon,
      label: 'ホーム',
      path: '/home',
    },
    {
      icon: FilePlusIcon,
      label: 'トレーニング記録',
      path: `/home/categories?date=${selectedDate.format('YYYY-MM-DD')}`,
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
      className="border-t border-t-accent bg-background px-4 py-1"
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
        <Icon aria-hidden className="h-8 w-8" />
      </Link>
    </li>
  );
}
