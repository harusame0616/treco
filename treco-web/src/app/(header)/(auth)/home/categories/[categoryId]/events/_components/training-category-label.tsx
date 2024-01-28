import React from 'react';

import { cachedQueryCategory } from '../_queries/queries';
import { TrainingCategoryLabelPresenter } from './training-events';

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
