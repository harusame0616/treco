'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export function LoginButtonList() {
  const providers = [
    {
      id: 'google',
      label: 'Google',
    },
    {
      id: 'twitter',
      label: 'X (Twitter)',
    },
    {
      id: 'facebook',
      label: 'facebook',
    },
  ] as const;

  return (
    <ul aria-label="ソーシャルログイン" className="flex flex-col gap-1">
      {providers.map(({ id, label }) => (
        <li aria-label={label} key={id}>
          <Button className="w-48 font-bold" onClick={() => signIn(id)}>
            {label} でログイン
          </Button>
        </li>
      ))}
    </ul>
  );
}
