'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function SignOutPage() {
  useEffect(() => {
    if (!signOut) {
      return;
    }

    signOut({
      callbackUrl: '/',
      redirect: true,
    });
  }, []);

  return (
    <div className="flex flex-col items-center p-8">
      <div className="mb-8">サインアウト中です</div>
      <div className="flex">
        <ReloadIcon className="animate-spin" />
      </div>
    </div>
  );
}
