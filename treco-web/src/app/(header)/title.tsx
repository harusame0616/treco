'use client';

import { createDate } from '@/lib/date';
import { useSearchParams } from 'next/navigation';

export function Title() {
  const searchParams = useSearchParams();
  const selectDate = createDate(searchParams.get('date') ?? undefined);

  return (
    <div className=" flex justify-center gap-1 text-xl font-bold">
      <div className="font-normal text-muted-foreground">
        {selectDate.format('YYYY年')}
      </div>
      <div className="font-bold text-primary">{selectDate.format('MM月')}</div>
      <div className="font-bold">{selectDate.format('DD日')}</div>
    </div>
  );
}
