'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LoginCheck() {
  const { getIdToken, isAuthenticated, isLoading, signOut } = useAuth();
  const [isPushed, setIsPushed] = useState(false); // 開発環境で２重で遷移するのを避ける
  const router = useRouter();

  useEffect(() => {
    if (
      isPushed ||
      !router ||
      !getIdToken ||
      isLoading ||
      !isAuthenticated ||
      !signOut
    ) {
      return;
    }

    getIdToken().then((idToken) => {
      fetch('/api/session/start', {
        body: JSON.stringify({
          id: idToken,
        }),
        method: 'POST',
      })
        .then(() => {
          setIsPushed(true);
          router.refresh();
        })
        .catch(() => {
          signOut();
        });
    });
  }, [isLoading, isAuthenticated, isPushed, getIdToken, router, signOut]);

  return null;
}
