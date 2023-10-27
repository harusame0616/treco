import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PrismaTrainingRecordQuery } from '@/domains/training-record/infrastructures/prisma.query';
import { TrainingRecordQueryOneForTrainingRecordEditUsecase } from '@/domains/training-record/usecases/query-one-for-training-record-edit.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { TrashIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { addSetAction, editSetAction } from './actions';
import { CancelButton } from './cancel-button';
import { SubmitButton } from './submit-button';

async function queryTrainingRecordEdit(trainingRecordId: string) {
  const queryUsecase = new TrainingRecordQueryOneForTrainingRecordEditUsecase(
    new PrismaTrainingRecordQuery(),
  );

  return await queryUsecase.execute(trainingRecordId);
}

type Props = {
  params: {
    categoryId: string;
    eventId: string;
    recordId: string;
  };
  searchParams: {
    edit?: string;
  };
};

export default async function TrainingRecordEditPage({
  params,
  searchParams,
}: Props) {
  const signedInTraineeId = await getSignedInTraineeId();
  const { sets, trainingCategory, trainingEvent } =
    await queryTrainingRecordEdit(params.recordId);
  const activeSetIndex = searchParams.edit
    ? parseInt(searchParams.edit, 10)
    : null;

  const {
    load: loadDefaultValue,
    note: noteDefaultValue,
    value: valueDefaultValue,
  } = activeSetIndex != null
    ? sets[activeSetIndex]
    : { load: '', note: '', value: '' };

  const isEditing = activeSetIndex != null;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full shrink-0 px-4">
        <span className="mr-2" style={{ color: trainingCategory.color }}>
          ●
        </span>
        <span>{trainingCategory.name}</span>
        <span className="mx-2">&gt;</span>
        <span>{trainingEvent.name}</span>
      </div>
      <div className="top-11 flex shrink-0 p-2 text-xs text-muted-foreground">
        <div className="w-12">セット</div>
        <div className="ml-1 w-12">負荷</div>
        <div className="ml-4 w-10">値</div>
        <div className="grow">備考</div>
      </div>
      <div className="h-full overflow-y-scroll bg-muted p-4">
        {sets.length ? (
          <ul className="">
            {sets.map(({ load, note, value }, index) => (
              <li
                className="flex h-16 border-b border-solid border-b-muted-foreground last:border-b-0"
                key={index}
              >
                <Link
                  className={`flex w-full text-foreground no-underline ${
                    activeSetIndex === index
                      ? 'rounded-sm font-bold text-primary'
                      : ''
                  }`}
                  href={`/home/categories/${params.categoryId}/events/${params.eventId}/records/${params.recordId}?edit=${index}`}
                >
                  <div
                    className={`mr-1 flex w-4 items-center justify-end  text-xs ${
                      activeSetIndex === index
                        ? 'font-bold text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="mr-1 flex w-12 items-center justify-end">
                    {load}
                  </div>
                  <div className="mr-8 flex w-12 items-center justify-end">
                    {value}
                  </div>
                  <div className="flex grow items-center">
                    <div className="max-h-10 w-12 grow overflow-y-auto whitespace-pre p-3 text-xs">
                      {note || '-'}
                    </div>
                  </div>
                </Link>
                <div className="flex items-center">
                  <Button size="icon" variant="ghost">
                    <TrashIcon />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <span className="block">まだ記録がありません。</span>
            <span className="block">
              下部のフォームから記録を追加してください。
            </span>
          </p>
        )}
      </div>
      <form
        action={isEditing ? editSetAction : addSetAction}
        className="flex shrink-0 flex-col gap-1 p-4"
      >
        <input
          name="trainingCategoryId"
          type="hidden"
          value={params.categoryId}
        />
        <input name="trainingEventId" type="hidden" value={params.eventId} />
        <input name="trainingRecordId" type="hidden" value={params.recordId} />
        <input name="traineeId" type="hidden" value={signedInTraineeId} />
        {isEditing && (
          <input name="index" type="hidden" value={activeSetIndex} />
        )}
        <div className="flex gap-4">
          <label className="flex items-center">
            <div className="mr-2 shrink-0">負荷</div>
            <Input
              autoFocus
              defaultValue={loadDefaultValue}
              inputMode="decimal"
              name="load"
              required
              step="0.01"
              type="number"
            />
          </label>
          <label className="flex items-center">
            <div className="mr-2 shrink-0">値</div>
            <Input
              defaultValue={valueDefaultValue}
              inputMode="decimal"
              name="value"
              required
              step="0.01"
              type="number"
            />
          </label>
        </div>
        <label className="flex">
          <div className="mr-2 shrink-0">備考</div>
          <Textarea
            className="h-1 grow"
            defaultValue={noteDefaultValue}
            name="note"
          />
        </label>
        <div className="flex justify-end gap-2">
          {isEditing && <CancelButton />}
          <SubmitButton>{isEditing ? '変更する' : '追加する'}</SubmitButton>
        </div>
      </form>
    </div>
  );
}
