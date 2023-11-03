import { type NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('x-pathname', req.nextUrl.pathname);
  response.headers.set('x-search-params', req.nextUrl.searchParams.toString());
  response.headers.set('x-trainee-id', req.nextUrl.searchParams.toString());

  return response;
}
