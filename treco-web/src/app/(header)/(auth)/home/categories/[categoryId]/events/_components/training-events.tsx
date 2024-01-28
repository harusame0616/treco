import { Skeleton } from '@/components/ui/skeleton';
import { getSignedInTraineeId } from '@/lib/trainee';

import { createNewRecordAction } from '../_actions';
import { cachedQueryCategory, queryTrainingEvents } from '../_queries/queries';
import { EventDelete } from './event-delete';
import { EventEdit } from './event-edit';

type TrainingEventsContainerProps = {
  categoryId: string;
  date: Date;
};
export async function TrainingEventsContainer({
  categoryId,
  date,
}: TrainingEventsContainerProps) {
  const signedInTraineeId = await getSignedInTraineeId();

  const category = await cachedQueryCategory(categoryId);
  const trainingEvents = await queryTrainingEvents(categoryId);

  return (
    <TrainingEventsPresenter
      category={category}
      date={date}
      traineeId={signedInTraineeId}
      trainingEvents={trainingEvents}
    />
  );
}
type TrainingEventsPresenterProps = {
  category: {
    name: string;
    trainingCategoryId: string;
  };
  date: Date;
  isSkeleton?: false;
  traineeId: string;
  trainingEvents: {
    loadUnit: string;
    name: string;
    trainingEventId: string;
    valueUnit: string;
  }[];
};

type TrainingEventsPresenterSkeletonProps = Partial<
  Omit<TrainingEventsPresenterProps, 'isSkeleton'>
> & {
  isSkeleton: true;
};
export function TrainingEventsPresenter({
  category,
  date,
  isSkeleton,
  traineeId,
  trainingEvents,
}: TrainingEventsPresenterProps | TrainingEventsPresenterSkeletonProps) {
  if (isSkeleton || trainingEvents.length) {
    return (
      <ul
        aria-label={
          isSkeleton ? 'トレーニング種目' : `${category.name}のトレーニング種目`
        }
        className="mb-2 flex w-full flex-col gap-2"
      >
        {isSkeleton
          ? Array.from({ length: 6 }).map((_, i) => (
              <TrainingEventItem isSkeleton key={i} />
            ))
          : trainingEvents.map((trainingEvent) => (
              <TrainingEventItem
                category={category}
                date={date}
                key={trainingEvent.trainingEventId}
                traineeId={traineeId}
                {...trainingEvent}
              />
            ))}
      </ul>
    );
  }

  return (
    <p className="p-4 text-center">トレーニング種目が登録されていません。</p>
  );
}

type TrainingEventItemProps = {
  category: {
    trainingCategoryId: string;
  };
  date: Date;
  isSkeleton?: false;
  loadUnit: string;
  name: string;
  traineeId: string;
  trainingEventId: string;
  valueUnit: string;
};

type TrainingEventItemSkeletonProps = Partial<
  Omit<TrainingEventItemProps, 'isSkeleton'>
> & { isSkeleton: true };

function TrainingEventItem({
  category,
  date,
  isSkeleton,
  loadUnit,
  name,
  traineeId,
  trainingEventId,
  valueUnit,
}: TrainingEventItemProps | TrainingEventItemSkeletonProps) {
  return (
    <li
      aria-label={name}
      className={`flex snap-x snap-mandatory flex-nowrap overflow-x-auto`}
    >
      {isSkeleton ? (
        <div className="flex h-16 min-w-full grow snap-start items-center rounded-md bg-muted p-4">
          <Skeleton className="h-5 w-32" />
        </div>
      ) : (
        <>
          <form
            action={createNewRecordAction}
            className="flex h-16 min-w-full grow snap-start items-center rounded-md bg-muted p-4"
          >
            <input
              name="trainingDate"
              type="hidden"
              value={date.toISOString()}
            />
            <input
              name="trainingCategoryId"
              type="hidden"
              value={category.trainingCategoryId}
            />
            <input
              name="trainingEventId"
              type="hidden"
              value={trainingEventId}
            />
            <input name="traineeId" type="hidden" value={traineeId} />
            <button className="block w-full overflow-x-hidden text-ellipsis whitespace-nowrap text-left text-foreground no-underline">
              <span className="grow text-xl ">{name}</span>
            </button>

            <EventEdit
              loadUnit={loadUnit}
              name={name}
              trainingCategoryId={category.trainingCategoryId}
              trainingEventId={trainingEventId}
              valueUnit={valueUnit}
            />
          </form>
          <div className="ml-4 h-16 w-16 snap-start">
            <EventDelete
              trainingCategoryId={category.trainingCategoryId}
              trainingEventId={trainingEventId}
            />
          </div>
        </>
      )}
    </li>
  );
}
