'use client';

import { useSelectedDate } from '@/app/hooks/use-selected-date';
import { useToday } from '@/app/hooks/use-today';
import { FilePlusIcon, HomeIcon, PersonIcon } from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import Link from 'next/link';

type MenuItemProps = {
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  path: string;
};
export function MenuItem({ icon: Icon, label, path }: MenuItemProps) {
  return (
    <li aria-label={label} key={path}>
      <Link
        aria-label={label}
        className="block p-4"
        href={path}
        prefetch={!path.includes('?')} // TODO: searchParams がある場合、 prefetch が有効だとうまく遷移しないことがあるので暫定的に無効化
      >
        <Icon className="h-8 w-8" />
      </Link>
    </li>
  );
}

export function NewTrainingRecordMenuItem() {
  const { selectedDate } = useSelectedDate();

  return (
    <MenuItem
      icon={FilePlusIcon}
      label="トレーニング記録"
      path={`/home/categories?date=${selectedDate?.toISOString()}`}
    />
  );
}

export function HomeMenuItem() {
  const { today } = useToday();

  return (
    <MenuItem
      icon={HomeIcon}
      label="ホーム"
      path={`/home?date=${today?.toISOString()}`}
    />
  );
}

export function AccountMenuItem() {
  return <MenuItem icon={PersonIcon} label="アカウント" path="/account" />;
}
