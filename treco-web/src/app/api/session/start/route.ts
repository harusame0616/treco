import type { NextApiRequest as Req, NextApiResponse as Res } from 'next';

import { auth } from '@/lib/firebase/admin'; // 上記で実装したファイル
import { NextRequest, NextResponse } from 'next/server';
import { SESSION_ID_COOKIE_NAME } from '@/lib/session';

export async function POST(request: NextRequest) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      { message: 'The id is required.' },
      { status: 400 }
    );
  }

  let sessionCookie;
  try {
    sessionCookie = await auth.createSessionCookie(id, { expiresIn });
  } catch (e) {
    return NextResponse.json(
      { message: 'The id is invalid.' },
      { status: 400 }
    );
  }

  const options = {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
    path: '/',
  };

  const response = new NextResponse();
  response.cookies.set(SESSION_ID_COOKIE_NAME, sessionCookie, options);

  return response;
}
