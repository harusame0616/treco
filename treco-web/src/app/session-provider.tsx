'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

export default function ({ children }: PropsWithChildren) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
