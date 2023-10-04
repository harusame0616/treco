import type { NextApiRequest as Req, NextApiResponse as Res } from 'next';

import { auth } from '@/lib/firebase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { SESSION_ID_COOKIE_NAME } from '@/lib/session';

export async function POST(request: NextRequest) {
  const response = new NextResponse();

  const sessionId = request.cookies.get(SESSION_ID_COOKIE_NAME)?.value;
  if (!sessionId) {
    return response;
  }

  const decodedClaims = await auth
    .verifySessionCookie(sessionId)
    .catch(() => null);

  if (decodedClaims) {
    await auth.revokeRefreshTokens(decodedClaims.sub);
  }

  response.cookies.delete(SESSION_ID_COOKIE_NAME);
  return response;
}
