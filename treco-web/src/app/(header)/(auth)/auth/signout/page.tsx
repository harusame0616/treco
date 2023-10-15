'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignOutPage() {
  const [isPushed, setIsPushed] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    if (isPushed || !router || !signOut) {
      return;
    }

    fetch('/api/session/clear', { method: 'POST' }).then(() => {
      signOut().then(() => {
        setIsPushed(true);
        router.refresh();
      });
    });
  }, [isPushed, router, signOut]);

  return <div className="text-center">サインアウト中です</div>;
}
