import { PrismaTrainingRecordQuery } from '@/domains/training-record/infrastructures/prisma.query';
import { TrainingRecordQueryTrainingMarksForCalendar } from '@/domains/training-record/usecases/query-training-marks-for-calendar.usecase';
import { clientDate, clientToday } from '@/lib/date';
import { getSignedInTraineeId } from '@/lib/trainee';
import { cn } from '@/lib/utils';
import { unstable_cache } from 'next/cache';

import { Day } from './day';

const getTrainingMarks = unstable_cache(
  (traineeId: string, start: Date, end: Date) => {
    const queryUsecase = new TrainingRecordQueryTrainingMarksForCalendar(
      new PrismaTrainingRecordQuery(),
    );

    return queryUsecase.execute({
      end,
      start,
      traineeId,
    });
  },
);

function getCalendarDays(month: number, year: number) {
  const startOfMonth = clientDate(`${year}-${month}-01`).startOf('month');
  const calendarStart = startOfMonth.subtract(startOfMonth.day(), 'day');

  return Array.from({ length: 7 * 6 }).map((_, index) =>
    calendarStart.add(index, 'day'),
  );
}

type MonthContainerProps = {
  month: number;
  selectedDate: Date;
  year: number;
};
export async function MonthContainer(props: MonthContainerProps) {
  const days = getCalendarDays(props.month, props.year);

  const trainingMarks = await getTrainingMarks(
    await getSignedInTraineeId(),
    days[0].toDate(),
    days.at(-1)!.toDate(),
  );

  // 日毎でグループ化し、更に同一カテゴリは統合する
  const trainingMarksGroupByDate = Object.fromEntries(
    Object.entries(
      trainingMarks
        ? trainingMarks.reduce(
            (group, record) => {
              const date = clientDate(record.trainingDate).format('YYYY-MM-DD');
              if (!group[date]) {
                group[date] = {};
              }
              group[date][record.trainingCategoryId] = record;

              return group;
            },
            {} as Record<
              string,
              Record<string, (typeof trainingMarks)[number]>
            >,
          )
        : {},
    ).map(([date, marks]) => [
      date,
      Object.entries(marks).map(([_, mark]) => mark.color),
    ]),
  );

  return <MonthPresenter {...props} trainingMarks={trainingMarksGroupByDate} />;
}

type MonthPresenterProps = {
  isSkeleton?: false;
  month: number;
  selectedDate: Date;
  trainingMarks: Record<string, string[]>;
  year: number;
};

type MonthPresenterSkeletonProps = Pick<
  MonthPresenterProps,
  'month' | 'selectedDate' | 'year'
> &
  Partial<Pick<MonthPresenterProps, 'trainingMarks'>> & {
    isSkeleton: true;
  };
export function MonthPresenter({
  isSkeleton,
  month,
  selectedDate,
  trainingMarks,
  year,
}: MonthPresenterProps | MonthPresenterSkeletonProps) {
  const days = getCalendarDays(month, year);
  const today = clientToday();

  return (
    <div className="grid w-full grid-cols-7">
      <div className="col-span-7 py-2 text-center text-xs font-bold text-muted-foreground">
        {year} 年 {month} 月
      </div>
      <DayOfWeekHeader />
      {days.map((day) => {
        return (
          <Day
            active={today.isSame(day, 'day')}
            date={day.toDate().toISOString()}
            highlight={day.isSame(selectedDate, 'day')}
            isSkeleton={isSkeleton}
            key={day.toISOString()}
            mute={day.month() + 1 !== month}
            trainingMarkColors={trainingMarks?.[day.format('YYYY-MM-DD')]}
            viewMonth={month}
            viewYear={year}
          />
        );
      })}
    </div>
  );
}

function DayOfWeekHeader() {
  const days = [
    {
      color: 'text-red-500',
      label: '日',
    },
    { label: '月' },
    { label: '火' },
    { label: '水' },
    { label: '木' },
    { label: '金' },
    { color: 'text-blue-500', label: '土' },
  ];

  return days.map(({ color, label }) => (
    <div
      className={cn(color, 'mb-4 text-center text-xs font-bold')}
      key={label}
    >
      {label}
    </div>
  ));
}
