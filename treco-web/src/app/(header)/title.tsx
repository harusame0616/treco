// layout からだと searchParams が取得できないため、 useSearchParams を使用して取得するために client component にしている
'use client';

import { utcDate } from '@/lib/date';
import { SearchParamsDateSchema } from '@/lib/searchParams';
import { useSearchParams } from 'next/navigation';
import { object, optional, parse } from 'valibot';

const SearchParamsSchema = object({
  date: optional(SearchParamsDateSchema),
});

type Props = {
  // クライアントコンポーネント内で new Date するとハイドレーションエラーが発生するため
  today: Date;
};

export function Title({ today }: Props) {
  const { date } = parse(
    SearchParamsSchema,
    Object.fromEntries(useSearchParams().entries()),
  );
  const selectedDate = utcDate(date ?? today).tz('Asia/Tokyo');

  return (
    <div className="flex justify-center gap-1 text-xl font-bold">
      <div className="font-normal text-muted-foreground">
        {selectedDate.format('YYYY年')}
      </div>
      <div className="font-bold text-primary">
        {selectedDate.format('MM月')}
      </div>
      <div className="font-bold">{selectedDate.format('D日')}</div>
    </div>
  );
}
