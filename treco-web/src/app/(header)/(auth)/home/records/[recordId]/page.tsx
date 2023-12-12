import { TrainingMark } from '@/components/training-mark';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PrismaTrainingRecordQuery } from '@/domains/training-record/infrastructures/prisma.query';
import { TrainingRecordQueryOneForTrainingRecordEditUsecase } from '@/domains/training-record/usecases/query-one-for-training-record-edit.usecase';
import { WithParams, WithSearchParams } from '@/lib/searchParams';
import { getSignedInTraineeId } from '@/lib/trainee';
import clsx from 'clsx';
import React from 'react';
import { object, optional, parse, regex, string, transform } from 'valibot';

import { addSetAction, editSetAction } from './actions';
import { CancelButton } from './cancel-button';
import { EditButton } from './edit-button';
import { SetDelete } from './set-delete';
import { SubmitButton } from './submit-button';

async function queryTrainingRecordEdit(trainingRecordId: string) {
  const queryUsecase = new TrainingRecordQueryOneForTrainingRecordEditUsecase(
    new PrismaTrainingRecordQuery(),
  );

  return await queryUsecase.execute(trainingRecordId);
}

const cachedQueryTrainingRecordEdit = React.cache(queryTrainingRecordEdit);

type Props = WithParams<'recordId', WithSearchParams>;

const SearchParamsSchema = object({
  edit: optional(transform(string([regex(/[0-9]+/)]), Number)),
});

export async function generateMetadata({ params }: Props) {
  const { trainingEvent } = await cachedQueryTrainingRecordEdit(
    params.recordId,
  );

  return {
    title: `${trainingEvent.name} の記録`,
  };
}

export default async function TrainingRecordEditPage({
  params,
  searchParams,
}: Props) {
  const { edit: activeSetIndex } = parse(SearchParamsSchema, searchParams);

  const signedInTraineeId = await getSignedInTraineeId();
  const { sets, trainingCategory, trainingEvent } =
    await cachedQueryTrainingRecordEdit(params.recordId);

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
      <div className="flex w-full shrink-0 items-center gap-2 px-4">
        <TrainingMark color={trainingCategory.color} size="small" />
        <span>{trainingCategory.name}</span>
        <span>&gt;</span>
        <span>{trainingEvent.name}</span>
      </div>
      <div className="top-11 flex shrink-0 p-2 text-xs text-muted-foreground">
        <div className="w-12">セット</div>
        <div className="ml-1 w-12">負荷</div>
        <div className="ml-4 w-10">値</div>
        <div className="grow">備考</div>
      </div>
      <div className="h-full overflow-y-auto bg-muted p-4">
        {sets.length ? (
          <ul aria-label="トレーニングセット">
            {sets.map(({ load, note, value }, index) => (
              <li
                aria-labelledby={`set-label${index}`}
                className={clsx(
                  'flex h-16 border-solid px-1',
                  activeSetIndex === index
                    ? 'rounded-md border border-primary'
                    : 'border-b border-b-muted-foreground last:border-b-0',
                )}
                key={index}
              >
                <div
                  aria-hidden
                  className={`mr-1 flex w-4 items-center justify-end  text-xs text-muted-foreground`}
                  id={`set-label${index}`}
                >
                  {index + 1}
                  <span className="sr-only">セット目</span>
                </div>
                <div
                  aria-label="負荷"
                  className="mr-1 flex w-12 items-center justify-end"
                >
                  {load}
                  <span className="sr-only ml-1 text-xs">
                    {trainingEvent.loadUnit}
                  </span>
                </div>
                <div
                  aria-label="値"
                  className="mr-8 flex w-12 items-center justify-end"
                >
                  {value}
                  <span className="sr-only ml-1 text-xs">
                    {trainingEvent.valueUnit}
                  </span>
                </div>
                <div aria-label="備考" className="flex grow items-center">
                  <div className="max-h-10 w-12 grow overflow-y-auto whitespace-pre p-3 text-xs">
                    {note || (
                      <>
                        <span aria-hidden>-</span>
                        <span className="sr-only">なし</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <EditButton index={index} />
                  <SetDelete
                    trainingRecordId={params.recordId}
                    trainingSetIndex={index}
                  />
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
        aria-label="トレーニングセットの追加・変更フォーム"
        className="flex shrink-0 flex-col gap-1 p-4"
        key={`${activeSetIndex}`}
      >
        <input name="trainingRecordId" type="hidden" value={params.recordId} />
        <input name="traineeId" type="hidden" value={signedInTraineeId} />
        {isEditing && (
          <input name="index" type="hidden" value={activeSetIndex} />
        )}
        <div className="flex gap-4">
          <label className="flex items-center" htmlFor="load">
            <div className="mr-2 shrink-0">負荷</div>
            <Input
              defaultValue={loadDefaultValue}
              id="load"
              inputMode="decimal"
              name="load"
              required
              step="0.01"
              type="number"
            />
          </label>
          <label className="flex items-center" htmlFor="value">
            <div className="mr-2 shrink-0">値</div>
            <Input
              defaultValue={valueDefaultValue}
              id="value"
              inputMode="decimal"
              name="value"
              required
              step="0.01"
              type="number"
            />
          </label>
        </div>
        <label className="flex" htmlFor="note">
          <div className="mr-2 shrink-0">備考</div>
          <Textarea
            className="h-1 grow"
            defaultValue={noteDefaultValue}
            id="note"
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
