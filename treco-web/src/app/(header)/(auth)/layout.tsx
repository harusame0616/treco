import { isAuthenticated } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function AuthLayout({ children }: PropsWithChildren) {
  if (await isAuthenticated()) {
    return <>{children}</>;
  }

  redirect('/');
}
