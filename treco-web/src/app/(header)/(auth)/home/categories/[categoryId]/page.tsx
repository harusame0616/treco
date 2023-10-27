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
      <p className="mb-4 text-sm text-muted-foreground">
        トレーニング種目を選択してください
      </p>
      <div className="mb-4">
        <span style={{ color: category.color }}>●</span> 胸
      </div>

      <ul
        aria-label={`${category.name}のトレーニング種目`}
        className="mb-2 flex w-full flex-col gap-2"
      >
        {trainingEvents.map(({ name, trainingEventId }) => (
          <li
            aria-label={name}
            className={`flex snap-x snap-mandatory flex-nowrap overflow-x-scroll`}
            key={trainingEventId}
          >
            <form
              action={createNewRecordAction}
              className="flex h-16 w-full min-w-full grow snap-start items-center rounded-md bg-muted p-4"
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
              <button className="block w-full overflow-x-hidden text-ellipsis whitespace-nowrap text-left text-foreground no-underline">
                <span className="grow text-xl ">{name}</span>
              </button>
              <Button aria-label="トレーニング種目名編集" variant={'ghost'}>
                <Pencil2Icon aria-hidden="true" className="h-6 w-6" />
              </Button>
            </form>
            <Button
              aria-label="削除"
              className="ml-4 h-16 w-16 snap-start"
              size="icon"
            >
              <TrashIcon aria-hidden="true" className="h-12 w-14" />
            </Button>
          </li>
        ))}
      </ul>
      <EventEdit trainingCategoryId={params.categoryId} />
    </div>
  );
}
