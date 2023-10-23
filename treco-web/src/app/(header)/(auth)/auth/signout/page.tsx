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
      redirect: true,
      callbackUrl: '/',
    });
  }, [signOut]);

  return (
    <div className="p-8 flex flex-col items-center">
      <div className="mb-8">サインアウト中です</div>
      <div className="flex">
        <ReloadIcon className="animate-spin" />
      </div>
    </div>
  );
}
