import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Suspense } from 'react';

import { MonthContainer, MonthPresenter } from './month';

type CalendarProps = {
  month: number;
  selectedDate: Date;
  year: number;
};
export function Calendar(props: CalendarProps) {
  return (
    <div className="flex bg-muted">
      <MonthStepChangeButton {...props} prev />
      <Suspense
        fallback={<MonthPresenter {...props} isSkeleton />}
        key={`${props.year}${props.month}`}
      >
        <MonthContainer {...props} />
      </Suspense>
      <MonthStepChangeButton {...props} next />{' '}
    </div>
  );
}

type MonthStepChangeButtonProps = (
  | { next: true; prev?: false }
  | { next?: false; prev: true }
) & { month: number; selectedDate: Date; year: number };
function MonthStepChangeButton({
  month,
  prev,
  selectedDate,
  year,
}: MonthStepChangeButtonProps) {
  const searchParams = new URLSearchParams(
    prev
      ? {
          viewMonth: String(month === 1 ? 12 : month - 1),
          viewYear: String(month === 1 ? year - 1 : year),
        }
      : {
          viewMonth: String(month === 12 ? 1 : month + 1),
          viewYear: String(month === 12 ? year + 1 : year),
        },
  );
  searchParams.set('date', selectedDate.toISOString());

  return (
    <Link
      className="m-1 flex items-center justify-center p-2 text-foreground hover:bg-muted-foreground active:bg-muted-foreground"
      href={`/home?${searchParams}`}
    >
      {prev ? (
        <ChevronLeftIcon aria-label="先月" />
      ) : (
        <ChevronRightIcon aria-label="来月" />
      )}
    </Link>
  );
}
