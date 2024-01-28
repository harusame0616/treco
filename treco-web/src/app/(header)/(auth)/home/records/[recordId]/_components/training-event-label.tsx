import { TrainingMark } from '@/components/training-mark';

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
  trainingCategoryColor: string;
  trainingCategoryName: string;
  trainingEventName: string;
};
function TrainingEventLabelPresenter({
  trainingCategoryColor,
  trainingCategoryName,
  trainingEventName,
}: TrainingEventLabelPresenterProps) {
  return (
    <div className="flex w-full shrink-0 items-center gap-2 px-4">
      <TrainingMark color={trainingCategoryColor} size="small" />
      <span>{trainingCategoryName}</span>
      <span>&gt;</span>
      <span>{trainingEventName}</span>
    </div>
  );
}
