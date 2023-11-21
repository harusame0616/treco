import { endpointEnum } from '@harusame0616/pino-newrelic-log-api-transport';
import { randomUUID } from 'crypto';
import { headers } from 'next/headers';
import pino from 'pino';

import { EventType, ServerLogger, eventTypeEnum } from '.';
import { env } from '../env';

export function createServerLogger() {
  return new VercelServerLogger(headers());
}

export function createMiddlewareLogger(_headers: ReturnType<typeof headers>) {
  return new VercelServerLogger(_headers);
}

function getLevel() {
  return env.NODE_ENV === 'development' ? 'debug' : env.LOG_LEVEL;
}

const level = getLevel();

export class VercelServerLogger implements ServerLogger {
  logger;
  constructor(_headers: ReturnType<typeof headers>) {
    this.logger = pino({
      base: {
        appHost: _headers.get('host'),
        appName: 'treco',
        appVer: '', // TODO: GITHUB の COMMIT HASH と連携したい
        city: _headers.get('x-vercel-ip-city'),
        country: _headers.get('x-vercel-ip-country'),
        entity: {
          // your app name
          name: 'treco',
        },

        ip: _headers.get('x-real-ip'),
        latitude: _headers.get('x-vercel-ip-latitude'),
        longitude: _headers.get('x-vercel-ip-longitude'),
        path: _headers.get('x-path'),
        pathname: _headers.get('x-pathname'),
        protocol: _headers.get('x-forwarded-proto'),
        requestId: _headers.get('x-vercel-id'),
        searchParams: _headers.get('x-search-params'),
        traineeId: _headers.get('x-trainee-id'),
        userAgent: _headers.get('User-Agent'),
        userType: _headers.get('x-trainee-id') ? 'trainee' : 'guest',
      },
      errorKey: 'error',
      formatters: {
        level: (label) => ({ level: label }),
      },
      level,
      messageKey: 'message',
      mixin() {
        return {
          logId: randomUUID(),
        };
      },
      timestamp: pino.stdTimeFunctions.isoTime, // 国際フォーマット
      transport: {
        level: 'info',
        options: {
          endpoint: endpointEnum.us,
        },
        target: '@harusame0616/pino-newrelic-log-api-transport',
      },
    });
  }

  debug(
    msg: string,
    data: Record<
      string,
      unknown & {
        func: { name: string };
      }
    >,
  ) {
    this.logger.debug(
      { ...data, eventType: data.eventType ?? eventTypeEnum.OTHER },
      msg,
    );
  }

  error(
    msg: string,
    data: Record<string, unknown> & {
      error: Error;
      eventType?: EventType;
      func: { name: string };
    },
  ) {
    this.logger.error({ ...data, eventType: eventTypeEnum.OTHER }, msg);
  }
  fatal(
    msg: string,
    data: Record<string, unknown> & {
      eventType?: EventType;
      func: { name: string };
    },
  ) {
    this.logger.fatal(
      { ...data, eventType: data.eventType ?? eventTypeEnum.OTHER },
      msg,
    );
  }

  info(
    msg: string,
    data: Record<string, unknown> & {
      eventType?: EventType;
      func: { name: string };
    },
  ) {
    this.logger.info(
      {
        ...data,
        eventType: data.eventType ?? eventTypeEnum.OTHER,
        func: data.func.name,
      },
      msg,
    );
  }

  warn(
    msg: string,
    data: Record<string, unknown> & {
      eventType?: EventType;
      func: { name: string };
    },
  ) {
    this.logger.warn(
      { ...data, eventType: data.eventType ?? eventTypeEnum.OTHER },
      msg,
    );
  }
}
