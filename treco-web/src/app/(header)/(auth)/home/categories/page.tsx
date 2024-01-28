import { SearchParamsDateSchema, WithSearchParams } from '@/lib/searchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { object, parse } from 'valibot';

import { CategoryEdit } from './_components/category-edit';
import {
  TrainingCategoriesContainer,
  TrainingCategoriesPresenter,
} from './_components/training-categories';

export const metadata: Metadata = {
  title: 'トレーニングカテゴリー一覧',
};
type Props = WithSearchParams;

const SearchParamsSchema = object({
  date: SearchParamsDateSchema,
});

export default function CategoriesPage({ searchParams }: Props) {
  const { date: selectedDate } = parse(SearchParamsSchema, searchParams);

  return (
    <div className="space-y-4 p-2">
      <p className="mb-4 text-sm text-muted-foreground">
        トレーニングカテゴリーを選択してください。左にスワイプすると削除できます。
      </p>
      <Suspense fallback={<TrainingCategoriesPresenter isSkeleton />}>
        <TrainingCategoriesContainer date={selectedDate} />
      </Suspense>
      <div className="mt-2">
        <CategoryEdit />
      </div>
    </div>
  );
}
