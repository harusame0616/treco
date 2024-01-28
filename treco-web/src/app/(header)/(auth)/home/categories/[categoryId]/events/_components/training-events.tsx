import { TrainingMark } from '@/components/training-mark';
import { getSignedInTraineeId } from '@/lib/trainee';

import { createNewRecordAction } from '../_actions';
import { cachedQueryCategory, queryTrainingEvents } from '../_queries/queries';
import { EventDelete } from './event-delete';
import { EventEdit } from './event-edit';

type TrainingCategoryLabelPresenterProps = {
  color: string;
  name: string;
};
export function TrainingCategoryLabelPresenter({
  color,
  name,
}: TrainingCategoryLabelPresenterProps) {
  return (
    <div className="mb-4 flex items-center gap-2" data-testid="category-name">
      <TrainingMark color={color} size="small" /> {name}
    </div>
  );
}

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
  traineeId: string;
  trainingEvents: {
    loadUnit: string;
    name: string;
    trainingEventId: string;
    valueUnit: string;
  }[];
};
function TrainingEventsPresenter({
  category,
  date,
  traineeId,
  trainingEvents,
}: TrainingEventsPresenterProps) {
  return (
    <ul
      aria-label={`${category.name}のトレーニング種目リスト`}
      className="mb-2 flex w-full flex-col gap-2"
    >
      {trainingEvents.length ? (
        trainingEvents.map(({ loadUnit, name, trainingEventId, valueUnit }) => (
          <li
            aria-label={name}
            className={`flex snap-x snap-mandatory flex-nowrap overflow-x-scroll`}
            key={trainingEventId}
          >
            <form
              action={createNewRecordAction}
              className="flex h-16 w-full min-w-full grow snap-start items-center rounded-md bg-muted p-4"
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
          </li>
        ))
      ) : (
        <p className="p-4 text-center">
          トレーニング種目が登録されていません。
        </p>
      )}
    </ul>
  );
}
