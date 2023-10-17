import pino from 'pino';
import { logflarePinoVercel } from 'pino-logflare';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});
