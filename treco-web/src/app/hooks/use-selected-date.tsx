import { SearchParamsDateSchema } from '@/lib/searchParams';
import { useSearchParams } from 'next/navigation';
import { object, optional, parse } from 'valibot';

import { useToday } from './use-today';

const SearchParamsSchema = object({
  date: optional(SearchParamsDateSchema),
});

export function useSelectedDate() {
  const { today } = useToday();

  const { date } = parse(
    SearchParamsSchema,
    Object.fromEntries(useSearchParams().entries()),
  );

  return { selectedDate: date ?? today };
}
