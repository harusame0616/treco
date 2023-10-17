import { logger } from '@/lib/logger';

export default function ErrorSamplePage() {
  logger.trace({ level: 'trace' }, 'test');
  logger.debug({ level: 'debug' }, 'test');
  logger.info({ level: 'info' }, 'test');
  logger.warn({ level: 'warn' }, 'test');
  logger.error({
    level: 'error',
    err: new Error('sample error'),
  });
  logger.fatal({
    level: 'fatal',
    err: new Error('sample error'),
  });
  return <div>error</div>;
}
