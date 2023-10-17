import { logger } from '@/lib/logger';

export default function ErrorSamplePage() {
  logger.trace({ msg: 'trace' });
  logger.debug({ msg: 'debug' });
  logger.info({ msg: 'info' });
  logger.warn({ msg: 'warn' });
  logger.error({
    msg: 'error',
    e: new Error('sample error'),
  });
  logger.fatal({
    msg: 'error',
    e: new Error('sample error'),
  });
  return <div>error</div>;
}
