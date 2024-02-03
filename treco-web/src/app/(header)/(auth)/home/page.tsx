import { TrainingMark } from '@/components/training-mark';
import { Skeleton } from '@/components/ui/skeleton';
import { PrismaTrainingRecordQuery } from '@/domains/training-record/infrastructures/prisma.query';
import { TrainingRecordQueryListForHomeUsecase } from '@/domains/training-record/usecases/query-list-for-home.usecase';
import { SearchParamsDateSchema, WithSearchParams } from '@/lib/searchParams';
import { getSignedInTraineeId } from '@/lib/trainee';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { object, optional, parse } from 'valibot';

import { Calendar } from './_component/calendar';
import { RecordDeleteButton } from './record-delete-button';

export const metadata: Metadata = {
  title: 'ホーム',
};

async function queryTrainingRecord(date: Date) {
  const traineeId = await getSignedInTraineeId();

  const query = new TrainingRecordQueryListForHomeUsecase(
    new PrismaTrainingRecordQuery(),
  );

  return await query.execute(traineeId, date);
}

type Props = WithSearchParams;

const SearchParamsSchema = object({
  date: optional(SearchParamsDateSchema),
});

export default async function HomePage({ searchParams }: Props) {
  const { date } = parse(SearchParamsSchema, searchParams);

  const selectedDate = date ?? new Date();

  return (
    <div className="flex h-full flex-col">
      <div className="bg-muted px-2 py-1">
        <Calendar />
      </div>
      <div className="flex flex-col overflow-auto px-2 py-1">
        <Suspense
          fallback={<TrainingRecordsSkeleton />}
          key={selectedDate.toISOString()}
        >
          <TrainingRecords date={selectedDate} />
        </Suspense>
      </div>
    </div>
  );
}

async function TrainingRecords({ date }: { date: Date }) {
  const trainingRecords = await queryTrainingRecord(date);

  return trainingRecords.length ? (
    <ul className="flex flex-col gap-4">
      {trainingRecords.map((record) => (
        <li key={record.trainingRecordId}>
          <div className="mb-2 flex items-center gap-2">
            <TrainingMark color={record.trainingCategory.color} size="small" />
            <span>{`${record.trainingCategory.name} - ${record.trainingEvent.name}`}</span>
            <Link
              className="block p-2"
              href={`/home/records/${record.trainingRecordId}`}
            >
              <span className="sr-only">トレーニング記録編集</span>
              <Pencil2Icon
                aria-hidden
                className="h-4 w-4 text-muted-foreground"
              />
            </Link>
            <RecordDeleteButton
              trainingCategoryName={record.trainingCategory.name}
              trainingEventName={record.trainingEvent.name}
              trainingRecordId={record.trainingRecordId}
            />
          </div>
          <ul className="rounded-md bg-muted p-4">
            {record.sets.map((set, index) => (
              <li className="flex gap-2" key={index}>
                <div className="mb-[3px] flex w-4 items-end justify-end text-xs text-muted-foreground">
                  {index + 1}
                </div>
                <div className="w-12 text-right text-lg">
                  {set.load}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {record.trainingEvent.loadUnit}
                  </span>
                </div>
                <div className="mr-4 w-12 text-right text-lg">
                  {set.value}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {record.trainingEvent.valueUnit}
                  </span>
                </div>
                <div className="grow text-lg">{set.note}</div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center text-muted-foreground">
      トレーニング記録はありません
    </p>
  );
}

function TrainingRecordsSkeleton() {
  return (
    <ul className="flex flex-col gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <li key={i}>
          <div className="mb-2 flex items-center gap-2">
            <TrainingMark isSkeleton size="small" />
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-1 w-2" />
            <Skeleton className="h-6 w-14" />
          </div>
          <Skeleton className="h-12 rounded-md bg-muted" />
        </li>
      ))}
    </ul>
  );
}
