import { TrainingMark } from '@/components/training-mark';

import { cachedQueryCategory } from '../_queries/queries';

type TrainingCategoryLabelContainerProps = {
  categoryId: string;
};
export async function TrainingCategoryLabelContainer({
  categoryId,
}: TrainingCategoryLabelContainerProps) {
  const category = await cachedQueryCategory(categoryId);

  return (
    <TrainingCategoryLabelPresenter
      color={category.color}
      name={category.name}
    />
  );
}

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
