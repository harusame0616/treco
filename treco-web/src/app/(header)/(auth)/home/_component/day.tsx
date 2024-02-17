import { TrainingMark } from '@/components/training-mark';
import { clientDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

type TrainingMarksProps = {
  isSkeleton?: boolean;
  trainingMarkColors?: string[];
};
function TrainingMarks({
  isSkeleton = false,
  trainingMarkColors = [],
}: TrainingMarksProps) {
  return (
    <ul className="grid grid-cols-5 gap-y-1">
      {isSkeleton
        ? Array.from({ length: 4 }).map((_, index) => (
            <li key={index}>
              <TrainingMark isSkeleton size="x-small" />
            </li>
          ))
        : trainingMarkColors.map((color) => (
            <li key={color}>
              <TrainingMark color={color} key={color} size="x-small" />
            </li>
          ))}
    </ul>
  );
}

type Props = PropsWithChildren<{
  active?: boolean;
  date: string;
  highlight?: boolean;
  isSkeleton?: boolean;
  mute?: boolean;
  trainingMarkColors?: string[];
  viewMonth: number;
  viewYear: number;
}>;

export function Day({
  active,
  date,
  highlight,
  isSkeleton = false,
  mute,
  trainingMarkColors,
  viewMonth,
  viewYear,
}: Props) {
  const style = cn(
    'text-white rounded-md h-12 transition flex flex-col px-1 no-underline block text-center',
    highlight && 'bg-muted-foreground',
    mute && 'opacity-40',
    active && 'font-black text-yellow-300',
  );

  const newSearchParams = new URLSearchParams({
    viewMonth: String(viewMonth),
    viewYear: String(viewYear),
  });
  newSearchParams.set('date', date);

  return (
    <Link className={style} href={`/home?${newSearchParams.toString()}`}>
      {clientDate(date).format('D')}
      <TrainingMarks
        isSkeleton={isSkeleton}
        trainingMarkColors={trainingMarkColors}
      />
    </Link>
  );
}
