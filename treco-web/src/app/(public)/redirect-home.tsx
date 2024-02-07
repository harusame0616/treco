'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// server component で getServerSession を使うとホーム画面が static rendering にならないのでクライアントコンポーネントで代替する
// event-emitter を使用しているので middleware でもできない

export function RedirectHome() {
  const { status } = useSession();
  const router = useRouter();

  console.log(status);
  if (status === 'authenticated') {
    router.replace('/home');
  }

  return null;
}
