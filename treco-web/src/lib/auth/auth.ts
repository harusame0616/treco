import { cookies } from 'next/headers';
import { auth } from '../firebase/admin';
import { SESSION_ID_COOKIE_NAME } from '@/lib/session';
import { cache } from 'react';

async function getSession() {
  const sessionId = cookies().get(SESSION_ID_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  return await auth.verifySessionCookie(sessionId).catch(() => null);
}

async function isAuthenticatedRaw() {
  return !!(await getSession());
}

export const isAuthenticated = cache(isAuthenticatedRaw);
