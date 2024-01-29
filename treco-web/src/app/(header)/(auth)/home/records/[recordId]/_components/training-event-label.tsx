import { TrainingMark } from '@/components/training-mark';
import { Skeleton } from '@/components/ui/skeleton';

import { cachedQueryTrainingRecordEdit } from '../queries';

type TrainingEventLabelContainerProps = {
  trainingRecordId: string;
};
export async function TrainingEventLabelContainer({
  trainingRecordId,
}: TrainingEventLabelContainerProps) {
  const { trainingCategory, trainingEvent } =
    await cachedQueryTrainingRecordEdit(trainingRecordId);

  return (
    <TrainingEventLabelPresenter
      trainingCategoryColor={trainingCategory.color}
      trainingCategoryName={trainingCategory.name}
      trainingEventName={trainingEvent.name}
    />
  );
}

type TrainingEventLabelPresenterProps = {
  isSkeleton?: false;
  trainingCategoryColor: string;
  trainingCategoryName: string;
  trainingEventName: string;
};
type TrainingEventLabelPresenterSkeletonProps = Partial<
  Omit<TrainingEventLabelPresenterProps, 'isSkeleton'>
> & { isSkeleton: true };

export function TrainingEventLabelPresenter({
  isSkeleton,
  trainingCategoryColor,
  trainingCategoryName,
  trainingEventName,
}:
  | TrainingEventLabelPresenterProps
  | TrainingEventLabelPresenterSkeletonProps) {
  return (
    <div className="flex w-full shrink-0 items-center gap-2 px-4">
      <TrainingMark
        size="small"
        {...(isSkeleton
          ? { isSkeleton: true }
          : {
              color: trainingCategoryColor,
            })}
      />
      <span>
        {isSkeleton ? <Skeleton className="h-5 w-32" /> : trainingCategoryName}
      </span>
      <span>&gt;</span>
      <span>
        {isSkeleton ? <Skeleton className="h-5 w-32" /> : trainingEventName}
      </span>
    </div>
  );
}
