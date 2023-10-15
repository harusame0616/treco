import { Button } from "@/components/ui/button";
import { PrismaTrainingCategoryQuery } from "@/domains/training-category/infrastructures/prisma.query";
import { TrainingCategoryQueryByTraineeIdUsecase } from "@/domains/training-category/usecases/query-by-trainee-id.usecase";
import { getSignedInTraineeId } from "@/lib/trainee";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import Link from "next/link";

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
    <div>
      <ul aria-label="トレーニングカテゴリー" className="w-full">
        {categories.length ? (
          categories.map(({ color, name, trainingCategoryId }) => (
            <li
              aria-label={name}
              className={`flex m-2 text-lg  snap-mandatory snap-x overflow-x-scroll flex-nowrap`}
              key={trainingCategoryId}
            >
              <div className="grow flex bg-muted w-full p-4 rounded-md items-center min-w-full snap-start h-16">
                <Link
                  className="text-foreground block w-full no-underline"
                  href={`/home/categories/${trainingCategoryId}?date=${selectDate.toISOString()}`}
                >
                  <span
                    aria-hidden="true"
                    className="mr-4 text-lg"
                    style={{ color }}
                  >
                    ●
                  </span>
                  <span className="text-3xl grow">{name}</span>
                </Link>
                <Button aria-label="カテゴリ名編集" variant={"ghost"}>
                  <Pencil2Icon aria-hidden="true" className="w-6 h-6" />
                </Button>
              </div>
              <Button
                aria-label="削除"
                className="ml-4 snap-start w-16 h-16"
                size="icon"
              >
                <TrashIcon aria-hidden="true" className="w-14 h-12" />
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
