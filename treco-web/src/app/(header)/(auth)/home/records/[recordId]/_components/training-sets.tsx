import { Skeleton } from '@/components/ui/skeleton';
import { TrainingEventDto } from '@/domains/training-event/models/training-event';
import { TrainingSet } from '@/domains/training-record/models/training-record';
import clsx from 'clsx';

import { cachedQueryTrainingRecordEdit } from '../queries';
import { EditButton } from './edit-button';
import { SetDelete } from './set-delete';

type TrainingSetsContainerProps = {
  selectedIndex?: number;
  trainingRecordId: string;
};
export async function TrainingSetsContainer({
  selectedIndex,
  trainingRecordId,
}: TrainingSetsContainerProps) {
  const { sets, trainingEvent } =
    await cachedQueryTrainingRecordEdit(trainingRecordId);

  return (
    <TrainingSetsPresenter
      selectedIndex={selectedIndex}
      sets={sets}
      trainingEvent={trainingEvent}
      trainingRecordId={trainingRecordId}
    />
  );
}

type TrainingSetsPresenterProps = {
  isSkeleton?: false;
  selectedIndex?: number;
  sets: TrainingSet[];
  trainingEvent: TrainingEventDto;
  trainingRecordId: string;
};
type TrainingSetsPresenterSkeletonProps = Partial<
  Omit<TrainingSetsPresenterProps, 'isSkeleton'>
> & {
  isSkeleton: true;
};
export function TrainingSetsPresenter({
  isSkeleton,
  selectedIndex,
  sets,
  trainingEvent,
  trainingRecordId,
}: TrainingSetsPresenterProps | TrainingSetsPresenterSkeletonProps) {
  return (
    <>
      <div className="top-11 flex shrink-0 p-2 text-xs text-muted-foreground">
        <div className="w-12">セット</div>
        <div className="ml-1 w-12">負荷</div>
        <div className="ml-4 w-10">値</div>
        <div className="grow">備考</div>
      </div>
      <div className="h-full overflow-y-auto bg-muted p-4">
        {isSkeleton ? (
          Array.from({ length: 6 }, (_, index) => (
            <TrainingSetItem index={index} isSkeleton key={index} />
          ))
        ) : sets.length ? (
          <ul aria-label="トレーニングセット">
            {sets.map((set, index) => (
              <TrainingSetItem
                index={index}
                isSelected={index === selectedIndex}
                key={index}
                set={set}
                trainingEvent={trainingEvent}
                trainingRecordId={trainingRecordId}
              />
            ))}
          </ul>
        ) : (
          <p>
            <span className="block">まだ記録がありません。</span>
            <span className="block">
              下部のフォームから記録を追加してください。
            </span>
          </p>
        )}
      </div>
    </>
  );
}
type TrainingSetItemProps = {
  index: number;
  isSelected: boolean;
  isSkeleton?: false;
  set: TrainingSet;
  trainingEvent: TrainingEventDto;
  trainingRecordId: string;
};
type TrainingSetItemSkeletonProps = Partial<
  Omit<TrainingSetItemProps, 'index' | 'isSkeleton'>
> &
  Pick<TrainingSetItemProps, 'index'> & {
    isSkeleton: true;
  };
function TrainingSetItem({
  index,
  isSelected,
  isSkeleton,
  set,
  trainingEvent,
  trainingRecordId,
}: TrainingSetItemProps | TrainingSetItemSkeletonProps) {
  return (
    <li
      aria-labelledby={`set-label${index}`}
      className={clsx(
        'flex h-16 border-solid px-1',
        isSelected
          ? 'rounded-md border border-primary'
          : 'border-b border-b-muted-foreground last:border-b-0',
      )}
    >
      <div
        aria-hidden
        className={`mr-1 flex w-4 items-center justify-end  text-xs text-muted-foreground`}
        id={`set-label${index}`}
      >
        {index + 1}
        <span className="sr-only">セット目</span>
      </div>
      <div
        aria-label="負荷"
        className="mr-1 flex w-12 items-center justify-end"
      >
        {isSkeleton ? (
          <Skeleton className="h-5 w-4" />
        ) : (
          <>
            {set.load}
            <span className="sr-only ml-1 text-xs">
              {trainingEvent.loadUnit}
            </span>
          </>
        )}
      </div>
      <div aria-label="値" className="mr-8 flex w-12 items-center justify-end">
        {isSkeleton ? (
          <Skeleton className="h-5 w-4" />
        ) : (
          <>
            {set.value}
            <span className="sr-only ml-1 text-xs">
              {trainingEvent.valueUnit}
            </span>
          </>
        )}
      </div>
      <div aria-label="備考" className="flex grow items-center">
        <div className="max-h-10 w-12 grow overflow-y-auto whitespace-pre p-3 text-xs">
          {isSkeleton ? (
            <Skeleton className="h-5 w-12" />
          ) : (
            <>
              {set.note || (
                <>
                  <span aria-hidden>-</span>
                  <span className="sr-only">なし</span>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {!isSkeleton && (
        <div className="flex items-center gap-2">
          <EditButton index={index} />
          <SetDelete
            trainingRecordId={trainingRecordId}
            trainingSetIndex={index}
          />
        </div>
      )}
    </li>
  );
}
