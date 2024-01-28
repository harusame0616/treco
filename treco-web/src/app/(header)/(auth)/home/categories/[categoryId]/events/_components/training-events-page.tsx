import { EventEdit } from './event-edit';
import { TrainingCategoryLabelContainer } from './training-category-label';
import { TrainingEventsContainer } from './training-events';

type TrainingEventsPageProps = {
  categoryId: string;
  date: Date;
};
export function TrainingEventsPage({
  categoryId,
  date,
}: TrainingEventsPageProps) {
  return (
    <div className="p-2">
      <p className="mb-4 text-sm text-muted-foreground">
        トレーニング種目を選択してください
      </p>
      <TrainingCategoryLabelContainer categoryId={categoryId} />
      <TrainingEventsContainer categoryId={categoryId} date={date} />

      <EventEdit trainingCategoryId={categoryId} />
    </div>
  );
}
