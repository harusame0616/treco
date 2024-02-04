import { Suspense } from 'react';

import { CategoryEdit } from './_components/category-edit';
import {
  TrainingCategoriesContainer,
  TrainingCategoriesPresenter,
} from './_components/training-categories';

type CategoriesPageProps = {
  date: Date;
};
export function CategoriesPage({ date }: CategoriesPageProps) {
  return (
    <div className="space-y-4 p-2">
      <p className="mb-4 text-sm text-muted-foreground">
        トレーニングカテゴリーを選択してください。
      </p>
      <Suspense fallback={<TrainingCategoriesPresenter isSkeleton />}>
        <TrainingCategoriesContainer date={date} />
      </Suspense>
      <div className="mt-2">
        <CategoryEdit />
      </div>
    </div>
  );
}
