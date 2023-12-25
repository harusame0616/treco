import { TrainingMark } from '@/components/training-mark';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PrismaTrainingCategoryQuery } from '@/domains/training-category/infrastructures/prisma.query';
import { TrainingCategoryDto } from '@/domains/training-category/models/training-category';
import { TrainingCategoryQueryByTraineeIdUsecase } from '@/domains/training-category/usecases/query-by-trainee-id.usecase';
import { SearchParamsDateSchema, WithSearchParams } from '@/lib/searchParams';
import { getSignedInTraineeId } from '@/lib/trainee';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { object, parse } from 'valibot';

import { CategoryDelete } from './_components/category-delete';
import { CategoryEdit } from './_components/category-edit';

export const metadata: Metadata = {
  title: 'トレーニングカテゴリー一覧',
};
async function queryCategories(props: { traineeId: string }) {
  const queryByTraineeIdUsecase = new TrainingCategoryQueryByTraineeIdUsecase(
    new PrismaTrainingCategoryQuery(),
  );

  return await queryByTraineeIdUsecase.execute(props);
}

type Props = WithSearchParams;

const SearchParamsSchema = object({
  date: SearchParamsDateSchema,
});

export default async function CategoriesPage({ searchParams }: Props) {
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

async function TrainingCategoriesContainer({ date }: { date: Date }) {
  const signedInTraineeId = await getSignedInTraineeId();
  const trainingCategories = await queryCategories({
    traineeId: signedInTraineeId,
  });

  return (
    <TrainingCategoriesPresenter
      date={date}
      trainingCategories={trainingCategories}
    />
  );
}

type TrainingCategoriesContainerProps =
  | {
      date: Date;
      isSkeleton?: false;
      trainingCategories: TrainingCategoryDto[];
    }
  | { date?: undefined; isSkeleton: true; trainingCategories?: undefined };
async function TrainingCategoriesPresenter({
  date,
  isSkeleton,
  trainingCategories,
}: TrainingCategoriesContainerProps) {
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

type TrainingCategoryItemProps =
  | {
      date: Date;
      isSkeleton?: false;
      trainingCategory: TrainingCategoryDto;
    }
  | {
      date?: undefined;
      isSkeleton: true;
      trainingCategory?: undefined;
    };
function TrainingCategoryItem({
  date,
  isSkeleton,
  trainingCategory,
}: TrainingCategoryItemProps) {
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
