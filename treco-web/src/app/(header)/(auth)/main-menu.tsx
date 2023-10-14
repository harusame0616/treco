"use client";

import { FilePlusIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function MainMenu() {
  const searchParams = useSearchParams();
  const selectedDate = dayjs(searchParams.get("date") || new Date());

  const menus = [
    {
      label: "ホーム",
      icon: HomeIcon,
      path: "/home",
    },
    {
      label: "トレーニング記録",
      icon: FilePlusIcon,
      path: `/home/categories?date=${selectedDate.toISOString()}`,
    },
    {
      label: "アカウント",
      icon: PersonIcon,
      path: "/home/account",
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
