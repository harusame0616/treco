import { headers } from 'next/headers';

import { VercelServerLogger } from './vercel-server-logger';

export const eventTypeEnum = {
  APPLICATION_ERROR: 'APPLICATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHENTICATION_SUCCESS: 'AUTHENTICATION_SUCCESS',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  DEBUG: 'DEBUG',
  INPUT_VALIDATION_ERROR: 'INPUT_VALIDATION_ERROR',
  OTHER: 'OTHER',
  OUTPUT_VALIDATION_ERROR: 'OUTPUT_VALIDATION_ERROR',
  SESSION_MANAGEMENT_ERROR: 'SESSION_MANAGEMENT_ERROR',
  USER_ACTION_VISIT: 'USER_ACTION_VISIT',
  USER_ADD: 'USER_ADD',
} as const;

export type EventTypeEnum = typeof eventTypeEnum;
export type EventType = EventTypeEnum[keyof EventTypeEnum];

export interface ServerLogger {
  debug(
    msg: string,
    data: Record<string, unknown & { func: { name: string } }>,
  ): void;

  error(
    msg: string,
    data: Record<string, unknown> & {
      error: Error;
      eventType?: EventType;
      func: { name: string };
    },
  ): void;
  fatal(
    msg: string,
    data: Record<string, unknown> & {
      eventType?: EventType;
      func: { name: string };
    },
  ): void;

  info(
    msg: string,
    data: Record<string, unknown> & {
      eventType?: EventType;
      func: { name: string };
    },
  ): void;

  warn(
    msg: string,
    data: Record<string, unknown> & {
      eventType?: EventType;
      func: { name: string };
    },
  ): void;
}

export function createServerLogger(): ServerLogger {
  return new VercelServerLogger(headers());
}
