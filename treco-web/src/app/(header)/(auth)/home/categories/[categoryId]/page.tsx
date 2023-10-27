import { Button } from '@/components/ui/button';
import { PrismaTrainingCategoryQuery } from '@/domains/training-category/infrastructures/prisma.query';
import { TrainingCategoryQueryByTraineeIdUsecase } from '@/domains/training-category/usecases/query-by-trainee-id.usecase';
import { PrismaTrainingEventQuery } from '@/domains/training-event/infrastructures/prisma.query';
import { TrainingEventQueryByTrainingCategoryId } from '@/domains/training-event/usecases/query-by-training-category-id.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { notFound } from 'next/navigation';

import { createNewRecordAction } from './actions';
import { EventEdit } from './event-edit';

async function queryTrainingEvents(trainingCategoryId: string) {
  const query = new TrainingEventQueryByTrainingCategoryId(
    new PrismaTrainingEventQuery(),
  );
  return await query.execute({ trainingCategoryId });
}

async function queryCategory(trainingCategoryId: string) {
  const signedInTraineeId = await getSignedInTraineeId();

  const query = new TrainingCategoryQueryByTraineeIdUsecase(
    new PrismaTrainingCategoryQuery(),
  );
  const categories = await query.execute({ traineeId: signedInTraineeId });

  const category = categories.find(
    (category) => category.trainingCategoryId === trainingCategoryId,
  );

  return category;
}

type Props = {
  params: {
    categoryId: string;
  };
  searchParams: {
    date: string;
  };
};
export default async function TrainingEventPage({
  params,
  searchParams,
}: Props) {
  const signedInTraineeId = await getSignedInTraineeId();

  const category = await queryCategory(params.categoryId);
  const trainingEvents = await queryTrainingEvents(params.categoryId);

  const selectDate = dayjs(searchParams.date);

  if (!category) {
    return notFound();
  }

  return (
    <div className="p-2">
      <p className="mb-4 text-muted-foreground text-sm">
        トレーニング種目を選択してください
      </p>
      <div className="mb-4">
        <span style={{ color: category.color }}>●</span> 胸
      </div>

      <ul
        aria-label={`${category.name}のトレーニング種目`}
        className="w-full flex flex-col gap-2 mb-2"
      >
        {trainingEvents.map(({ name, trainingEventId }) => (
          <li
            aria-label={name}
            className={`flex snap-mandatory snap-x overflow-x-scroll flex-nowrap`}
            key={trainingEventId}
          >
            <form
              action={createNewRecordAction}
              className="grow flex bg-muted w-full p-4 rounded-md items-center min-w-full snap-start h-16"
            >
              <input
                name="trainingDate"
                type="hidden"
                value={selectDate.toISOString()}
              />
              <input
                name="trainingCategoryId"
                type="hidden"
                value={params.categoryId}
              />
              <input
                name="trainingEventId"
                type="hidden"
                value={trainingEventId}
              />
              <input name="traineeId" type="hidden" value={signedInTraineeId} />
              <button className="text-foreground block w-full no-underline text-left whitespace-nowrap overflow-x-hidden text-ellipsis">
                <span className="text-xl grow ">{name}</span>
              </button>
              <Button aria-label="トレーニング種目名編集" variant={'ghost'}>
                <Pencil2Icon aria-hidden="true" className="w-6 h-6" />
              </Button>
            </form>
            <Button
              aria-label="削除"
              className="ml-4 snap-start w-16 h-16"
              size="icon"
            >
              <TrashIcon aria-hidden="true" className="w-14 h-12" />
            </Button>
          </li>
        ))}
      </ul>
      <EventEdit trainingCategoryId={params.categoryId} />
    </div>
  );
}
