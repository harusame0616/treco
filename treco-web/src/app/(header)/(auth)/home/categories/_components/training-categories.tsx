import { LinkListItemWithAction } from '@/components/list-item';
import { TrainingMark } from '@/components/training-mark';
import { Skeleton } from '@/components/ui/skeleton';
import { TrainingCategoryDto } from '@/domains/training-category/models/training-category';

import { queryMyCategories } from '../queries';
import { CategoryDeleteButton } from './category-delete-button';
import { CategoryEdit } from './category-edit';

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
  function Action() {
    return (
      !isSkeleton && (
        <>
          <CategoryEdit
            color={trainingCategory.color}
            name={trainingCategory.name}
            trainingCategoryId={trainingCategory.trainingCategoryId}
          />
          <CategoryDeleteButton
            trainingCategoryId={trainingCategory.trainingCategoryId}
            trainingCategoryName={trainingCategory.name}
          />
        </>
      )
    );
  }

  return (
    <LinkListItemWithAction
      action={<Action />}
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
    </LinkListItemWithAction>
  );
}
