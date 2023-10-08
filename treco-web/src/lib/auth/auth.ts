import { cookies } from 'next/headers';
import { auth } from '../firebase/admin';
import { SESSION_ID_COOKIE_NAME } from '@/lib/session';
import { cache } from 'react';

export async function getSession() {
  const sessionId = cookies().get(SESSION_ID_COOKIE_NAME)?.value;

  if (!sessionId) {
    throw new Error('No session ID cookie found');
  }

  try {
    return await auth.verifySessionCookie(sessionId);
  } catch (e) {
    throw new Error('Invalid session ID cookie');
  }
}

async function isAuthenticatedRaw() {
  return !!(await getSession().catch(() => null));
}

export const isAuthenticated = cache(isAuthenticatedRaw);
