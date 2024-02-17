'use client';

import { SearchParamsDateSchema } from '@/lib/searchParams';
import { FilePlusIcon, HomeIcon, PersonIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { object, optional, parse } from 'valibot';

type Props = {
  // クライアントコンポーネント内で new Date するとハイドレーションエラーが発生する
  // layout.tsx では searchParams が取得できないため、 searchParams があるかないかで選択日を判定することができないため、
  // 選択日が内場合のフォールバック用現在日時だけ受け取り、判定はこのコンポーネントで行う。
  currentDate: Date;
};

const SearchParamsSchema = object({
  date: optional(SearchParamsDateSchema),
});

export function MainMenu({ currentDate }: Props) {
  const { date } = parse(
    SearchParamsSchema,
    Object.fromEntries(useSearchParams().entries()),
  );
  const selectedDate = date ?? currentDate;

  const menus = [
    {
      icon: HomeIcon,
      label: 'ホーム',
      path: '/home',
    },
    {
      icon: FilePlusIcon,
      label: 'トレーニング記録を作成',
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
      <Link
        href={path}
        prefetch={!path.includes('?')} // TODO: searchParams がある場合、 prefetch が有効だとうまく遷移しないことがあるので暫定的に無効化
      >
        <Icon aria-label={label} className="h-8 w-8" />
      </Link>
    </li>
  );
}
