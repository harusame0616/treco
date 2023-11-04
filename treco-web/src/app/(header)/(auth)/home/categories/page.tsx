import { Button } from '@/components/ui/button';
import { PrismaTrainingCategoryQuery } from '@/domains/training-category/infrastructures/prisma.query';
import { TrainingCategoryQueryByTraineeIdUsecase } from '@/domains/training-category/usecases/query-by-trainee-id.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import dayjs from 'dayjs';
import Link from 'next/link';

import { CategoryDelete } from './_components/category-delete';
import { CategoryEdit } from './_components/category-edit';

async function queryCategories(props: { traineeId: string }) {
  const queryByTraineeIdUsecase = new TrainingCategoryQueryByTraineeIdUsecase(
    new PrismaTrainingCategoryQuery(),
  );

  return await queryByTraineeIdUsecase.execute(props);
}

type Props = {
  searchParams: {
    date: string;
  };
};
export default async function CategoryPage({ searchParams }: Props) {
  const signedInTraineeId = await getSignedInTraineeId();

  const categories = await queryCategories({ traineeId: signedInTraineeId });
  const selectDate = dayjs(searchParams.date);

  return (
    <div className="p-2">
      <p className="mb-4 text-sm text-muted-foreground">
        トレーニングカテゴリーを選択してください。左にスワイプすると削除できます。
      </p>

      <ul
        aria-label="トレーニングカテゴリー"
        className="flex w-full flex-col gap-2"
      >
        {categories.length ? (
          categories.map(({ color, name, trainingCategoryId }) => (
            <li
              aria-label={name}
              className={`flex snap-x snap-mandatory flex-nowrap overflow-x-scroll text-lg`}
              key={trainingCategoryId}
            >
              <div className="flex h-16 w-full min-w-full grow snap-start items-center rounded-md bg-muted p-4">
                <Link
                  className="block w-full text-foreground no-underline"
                  href={`/home/categories/${trainingCategoryId}/events?date=${selectDate.format(
                    'YYYY-MM-DD',
                  )}`}
                >
                  <span
                    aria-hidden="true"
                    className="mr-4 text-lg"
                    style={{ color }}
                  >
                    ●
                  </span>
                  <span className="grow text-3xl">{name}</span>
                </Link>
                <Button aria-label="カテゴリ名編集" variant={'ghost'}>
                  <CategoryEdit
                    color={color}
                    name={name}
                    trainingCategoryId={trainingCategoryId}
                  />
                </Button>
              </div>
              <div className="ml-4 h-16 w-16 snap-start">
                <CategoryDelete trainingCategoryId={trainingCategoryId} />
              </div>
            </li>
          ))
        ) : (
          <p className="p-4 text-center">
            トレーニングカテゴリーが登録されていません。
          </p>
        )}
      </ul>
      <div className="mt-2">
        <CategoryEdit />
      </div>
    </div>
  );
}
