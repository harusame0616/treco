import { logger } from '@/lib/logger';

export default function ErrorSamplePage() {
  logger.error(
    {
      e: new Error('sample error'),
    },
    'sample error',
  );
  return <div>error</div>;
}
