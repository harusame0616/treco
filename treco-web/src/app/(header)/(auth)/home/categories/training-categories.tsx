import { TrainingMark } from '@/components/training-mark';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrainingCategoryDto } from '@/domains/training-category/models/training-category';
import Link from 'next/link';

import { CategoryDelete } from './_components/category-delete';
import { CategoryEdit } from './_components/category-edit';
import { queryMyCategories } from './queries';

export async function TrainingCategoriesContainer({ date }: { date: Date }) {
  const trainingCategories = await queryMyCategories();

  return (
    <TrainingCategoriesPresenter
      date={date}
      trainingCategories={trainingCategories}
    />
  );
}

type TrainingCategoriesPresenterProps = {
  date: Date;
  isSkeleton?: false;
  trainingCategories: TrainingCategoryDto[];
};
type TrainingCategoriesPresenterSkeltonProps = Partial<
  Omit<TrainingCategoriesPresenterProps, 'isSkeleton'>
> & { isSkeleton: true };

export async function TrainingCategoriesPresenter({
  date,
  isSkeleton,
  trainingCategories,
}: TrainingCategoriesPresenterProps | TrainingCategoriesPresenterSkeltonProps) {
  if (isSkeleton || trainingCategories.length) {
    return (
      <ul
        aria-label="トレーニングカテゴリー"
        className="flex w-full flex-col gap-2"
      >
        {isSkeleton
          ? Array.from({ length: 6 }).map((_, i) => (
              <TrainingCategoryItem isSkeleton key={i} />
            ))
          : trainingCategories.map((trainingCategory) => (
              <TrainingCategoryItem
                date={date}
                key={trainingCategory.trainingCategoryId}
                trainingCategory={trainingCategory}
              />
            ))}
      </ul>
    );
  }

  return (
    <p className="p-4 text-center">
      トレーニングカテゴリーが登録されていません。
    </p>
  );
}
type TrainingCategoryItemProps = {
  date: Date;
  isSkeleton?: false;
  trainingCategory: TrainingCategoryDto;
};
type TrainingCategoryItemSkeletonProps = Partial<
  Omit<TrainingCategoryItemProps, 'isSkeleton'>
> & { isSkeleton: true };

function TrainingCategoryItem({
  date,
  isSkeleton,
  trainingCategory,
}: TrainingCategoryItemProps | TrainingCategoryItemSkeletonProps) {
  return (
    <li className="flex snap-x snap-mandatory flex-nowrap overflow-x-scroll text-lg">
      <div className="flex h-16 w-full min-w-full grow snap-start items-center rounded-md bg-muted p-4">
        <Link
          className="flex w-full items-center gap-4 text-foreground no-underline"
          href={{
            pathname: `/home/categories/${trainingCategory?.trainingCategoryId}/events`,
            query: {
              date: date?.toISOString(),
            },
          }}
        >
          <TrainingMark
            {...(isSkeleton
              ? { isSkeleton: true }
              : { color: trainingCategory.color })}
            size="small"
          />
          {isSkeleton ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <span className="grow text-3xl">{trainingCategory.name}</span>
          )}
        </Link>
        {!isSkeleton && (
          <Button aria-label="カテゴリ名編集" variant={'ghost'}>
            <CategoryEdit
              color={trainingCategory?.color}
              name={trainingCategory?.name}
              trainingCategoryId={trainingCategory?.trainingCategoryId}
            />
          </Button>
        )}
      </div>
      {!isSkeleton && (
        <div className="ml-4 h-16 w-16 snap-start">
          <CategoryDelete
            trainingCategoryId={trainingCategory?.trainingCategoryId}
          />
        </div>
      )}
    </li>
  );
}
