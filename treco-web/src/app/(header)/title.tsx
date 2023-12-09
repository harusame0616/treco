'use client';

import { SearchParamsDateSchema } from '@/lib/searchParams';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { object, optional, parse } from 'valibot';

const SearchParamsSchema = object({
  date: optional(SearchParamsDateSchema),
});

export function Title() {
  const { date } = parse(
    SearchParamsSchema,
    Object.fromEntries(useSearchParams().entries()),
  );
  const selectedDate = dayjs(date ?? new Date());

  return (
    <div className="flex justify-center gap-1 text-xl font-bold">
      <div className="font-normal text-muted-foreground">
        {selectedDate.format('YYYY年')}
      </div>
      <div className="font-bold text-primary">
        {selectedDate.format('MM月')}
      </div>
      <div className="font-bold">{selectedDate.format('DD日')}</div>
    </div>
  );
}
