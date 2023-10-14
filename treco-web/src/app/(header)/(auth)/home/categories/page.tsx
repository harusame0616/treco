import { Button } from '@/components/ui/button';
import { PrismaTrainingCategoryQuery } from '@/domains/training-category/infrastructures/prisma.query';
import { TrainingCategory } from '@/domains/training-category/models/training-cateogry';
import { TrainingCategoryQueryByTraineeIdUsecase } from '@/domains/training-category/usecases/query-by-trainee-id.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import Link from 'next/link';

async function queryCategories(props: { traineeId: string }) {
  const queryByTraineeIdUsecase = new TrainingCategoryQueryByTraineeIdUsecase(
    new PrismaTrainingCategoryQuery()
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
    <div>
      <ul aria-label="トレーニングカテゴリー" className="w-full">
        {categories.length ? (
          categories.map(({ trainingCategoryId, name, color }) => (
            <li
              key={trainingCategoryId}
              className={`flex m-2 text-lg  snap-mandatory snap-x overflow-x-scroll flex-nowrap`}
              aria-label={name}
            >
              <div className="grow flex bg-muted w-full p-4 rounded-md items-center min-w-full snap-start h-16">
                <Link
                  href={`/home/categories/${trainingCategoryId}?date=${selectDate.toISOString()}`}
                  className="text-foreground block w-full no-underline"
                >
                  <span
                    className="mr-4 text-lg"
                    style={{ color }}
                    aria-hidden="true"
                  >
                    ●
                  </span>
                  <span className="text-3xl grow">{name}</span>
                </Link>
                <Button variant={'ghost'} aria-label="カテゴリ名編集">
                  <Pencil2Icon className="w-6 h-6" aria-hidden="true" />
                </Button>
              </div>
              <Button
                className="ml-4 snap-start w-16 h-16"
                size="icon"
                aria-label="削除"
              >
                <TrashIcon className="w-14 h-12" aria-hidden="true" />
              </Button>
            </li>
          ))
        ) : (
          <p className="text-center p-4">カテゴリーが登録されていません。</p>
        )}
      </ul>
    </div>
  );
}
