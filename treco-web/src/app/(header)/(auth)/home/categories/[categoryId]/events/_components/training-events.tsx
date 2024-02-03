import { Skeleton } from '@/components/ui/skeleton';

import { createNewRecordAction } from '../_actions';
import { cachedQueryCategory, queryTrainingEvents } from '../_queries/queries';
import { EventDeleteButton } from './event-delete-button';
import { EventEdit } from './event-edit';

type TrainingEventsContainerProps = {
  categoryId: string;
  date: Date;
};
export async function TrainingEventsContainer({
  categoryId,
  date,
}: TrainingEventsContainerProps) {
  const category = await cachedQueryCategory(categoryId);
  const trainingEvents = await queryTrainingEvents(categoryId);

  return (
    <TrainingEventsPresenter
      category={category}
      date={date}
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
  trainingEventId,
  valueUnit,
}: TrainingEventItemProps | TrainingEventItemSkeletonProps) {
  return (
    <li aria-label={name} className="flex flex-nowrap">
      {isSkeleton ? (
        <div className="flex h-16 min-w-full items-center rounded-md bg-muted p-4">
          <Skeleton className="h-5 w-32" />
        </div>
      ) : (
        <form
          action={createNewRecordAction.bind(null, {
            trainingCategoryId: category.trainingCategoryId,
            trainingDate: date,
            trainingEventId,
          })}
          className="flex h-16 min-w-full grow items-center rounded-md bg-muted p-4"
        >
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
          <EventDeleteButton
            trainingCategoryId={category.trainingCategoryId}
            trainingEventId={trainingEventId}
            trainingEventName={name}
          />
        </form>
      )}
    </li>
  );
}
