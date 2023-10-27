import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { cache } from 'react';

async function isAuthenticatedRaw() {
  const session = await getServerSession(authOptions);
  return !!session;
}

export const isAuthenticated = cache(isAuthenticatedRaw);
