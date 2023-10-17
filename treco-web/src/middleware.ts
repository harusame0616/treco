import { NextRequest, NextResponse } from 'next/server';
import { logger } from './lib/logger';

export function middleware(req: NextRequest) {
  // logger.info(
  //   {
  //     ip: req.ip,
  //     ua: req.headers.get('user-agent'),
  //   },
  //   'test',
  // );

  return NextResponse.next();
}
