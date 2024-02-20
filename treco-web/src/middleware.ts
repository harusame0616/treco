import { type NextRequest, NextResponse } from 'next/server';

import { isAuthenticated } from './lib/auth/auth';
export async function middleware(req: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('x-pathname', req.nextUrl.pathname);
  response.headers.set('x-search-params', req.nextUrl.searchParams.toString());
  response.headers.set('x-trainee-id', req.nextUrl.searchParams.toString());

  if (req.nextUrl.pathname === '/' && (await isAuthenticated())) {
    return NextResponse.redirect('/dashboard', {
      headers: response.headers,
      status: 307,
    });
  }

  if (/\/home\/.*/.test(req.nextUrl.pathname) && !(await isAuthenticated())) {
    return NextResponse.redirect('/', {
      headers: response.headers,
      status: 307,
    });
  }

  return response;
}
