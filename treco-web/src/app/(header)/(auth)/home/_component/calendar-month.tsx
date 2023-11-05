'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { TrainingRecordQueryTrainingMarksPerMonthForCalendar } from '@/domains/training-record/usecases/query-training-marks-per-month-for-calendar.usecase';
import { createDate } from '@/lib/date';
import dayjs from 'dayjs';
import useSWR from 'swr';

import { Day } from './day';

type Props = {
  month: number;
  onSelectDate: (date: Date) => void;
  selectDate: Date;
  year: number;
};

export function CalendarMonth({
  month,
  onSelectDate,
  selectDate,
  year,
}: Props) {
  const daysOfWeek = [
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

  const firstDate = dayjs(`${year}-${month}-01`).startOf('month');
  const dayOfFirstDate = firstDate.day();
  const calenderStart = firstDate.subtract(dayOfFirstDate, 'day');
  const days = new Array(7 * 6)
    .fill(0)
    .map((_, index) => calenderStart.add(index, 'day'));

  const apiUrl = new URL(
    '/api/query-training-marks-per-month-for-calendar',
    'http://localhost:3000',
  );
  apiUrl.searchParams.set('date', firstDate.toISOString());

  const { data, isLoading } = useSWR<
    Awaited<
      ReturnType<TrainingRecordQueryTrainingMarksPerMonthForCalendar['execute']>
    >
  >(apiUrl.href, (url: string) =>
    fetch(url).then(async (data) => await data.json()),
  );

  // 日毎でグループ化し、更に同一カテゴリは統合する
  const trainingMarks = data
    ? data.reduce(
        (group, record) => {
          const date = createDate(record.trainingDate).utc().toISOString();
          if (!group[date]) {
            group[date] = {};
          }
          group[date][record.trainingCategoryId] = record;

          return group;
        },
        {} as Record<string, Record<string, (typeof data)[number]>>,
      )
    : {};

  return (
    <div className="grid grid-cols-7 bg-muted">
      {daysOfWeek.map((day) => (
        <div
          className={`${day.color} mb-1 text-center text-xs`}
          key={day.label}
        >
          {day.label}
        </div>
      ))}
      {days.map((day) => {
        return (
          <Day
            active={dayjs().isSame(day, 'day')}
            date={day.toDate()}
            highlight={day.isSame(selectDate, 'day')}
            key={day.format('YYYY-MM-DD')}
            mute={!day.isSame(firstDate, 'month')}
            onSelectDate={onSelectDate}
          >
            {
              <ul className="grid grid-cols-5 gap-y-1">
                {isLoading ? (
                  <>
                    <Skeleton className="h-2 w-2 rounded-full"></Skeleton>
                    <Skeleton className="h-2 w-2 rounded-full"></Skeleton>
                    <Skeleton className="h-2 w-2 rounded-full"></Skeleton>
                    <Skeleton className="h-2 w-2 rounded-full"></Skeleton>
                    <Skeleton className="h-2 w-2 rounded-full"></Skeleton>
                    <Skeleton className="h-2 w-2 rounded-full"></Skeleton>
                    <Skeleton className="h-2 w-2 rounded-full"></Skeleton>
                  </>
                ) : (
                  Object.entries(
                    trainingMarks[day.utc().toISOString()] ?? {},
                  ).map(([_, mark]) => (
                    <ol
                      className="flex justify-center"
                      key={mark.trainingRecordId}
                      style={{ color: mark.color }}
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: mark.color }}
                      />
                    </ol>
                  ))
                )}
              </ul>
            }
          </Day>
        );
      })}
    </div>
  );
}
