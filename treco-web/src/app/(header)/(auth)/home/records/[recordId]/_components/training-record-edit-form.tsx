import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { addSetAction, editSetAction } from '../_actions';
import { cachedQueryTrainingRecordEdit } from '../queries';
import { CancelButton } from './cancel-button';
import { SubmitButton } from './submit-button';

type TrainingRecordEditFormContainerProps = {
  selectedSetIndex: number | undefined;
  trainingRecordId: string;
};
export async function TrainingRecordEditFormContainer({
  selectedSetIndex,
  trainingRecordId,
}: TrainingRecordEditFormContainerProps) {
  const { sets } = await cachedQueryTrainingRecordEdit(trainingRecordId);

  const {
    load: loadDefaultValue,
    note: noteDefaultValue,
    value: valueDefaultValue,
  } = selectedSetIndex != null
    ? sets[selectedSetIndex]
    : { load: '', note: '', value: '' };

  const isEditing = selectedSetIndex != null;

  return (
    <TrainingRecordEditFormPresenter
      isEditing={isEditing}
      load={loadDefaultValue}
      note={noteDefaultValue}
      selectedSetIndex={selectedSetIndex}
      trainingRecordId={trainingRecordId}
      value={valueDefaultValue}
    />
  );
}

type TrainingRecordEditFormPresenterProps = {
  isEditing: boolean;
  isSkeleton?: false;
  load: number | string;
  note: string;
  selectedSetIndex: number | undefined;
  trainingRecordId: string;
  value: number | string;
};

type TrainingRecordEditFormPresenterSkeletonProps = Partial<
  Omit<TrainingRecordEditFormPresenterProps, 'isSkeleton'>
> & { isSkeleton: true };

export function TrainingRecordEditFormPresenter({
  isEditing,
  isSkeleton,
  load,
  note,
  selectedSetIndex,
  trainingRecordId,
  value,
}:
  | TrainingRecordEditFormPresenterProps
  | TrainingRecordEditFormPresenterSkeletonProps) {
  const action = isSkeleton
    ? undefined
    : isEditing && selectedSetIndex != null
    ? editSetAction.bind(null, {
        index: selectedSetIndex,
        trainingRecordId,
      })
    : addSetAction.bind(null, { trainingRecordId });

  return (
    <form
      action={action}
      aria-label="トレーニングセットの追加・変更フォーム"
      className="flex shrink-0 flex-col gap-1 p-4"
      key={`${selectedSetIndex}`} // 編集後フォームを再描画するため key を設定
    >
      <div className="flex gap-4">
        <div className="flex items-center">
          <label className="mr-2 shrink-0" htmlFor="load">
            負荷
          </label>
          <Input
            defaultValue={load}
            disabled={isSkeleton}
            id="load"
            inputMode="decimal"
            name="load"
            required
            step="0.01"
            type="number"
          />
        </div>
        <div className="flex items-center">
          <label className="mr-2 shrink-0" htmlFor="value">
            値
          </label>
          <Input
            defaultValue={value}
            disabled={isSkeleton}
            id="value"
            inputMode="decimal"
            name="value"
            required
            step="0.01"
            type="number"
          />
        </div>
      </div>
      <div className="flex">
        <label className="mr-2 shrink-0" htmlFor="note">
          備考
        </label>
        <Textarea
          className="h-1 grow"
          defaultValue={note}
          disabled={isSkeleton}
          id="note"
          name="note"
        />
      </div>
      <div className="flex justify-end gap-2">
        {isEditing && <CancelButton />}
        <SubmitButton disabled={isSkeleton}>
          {isEditing ? '変更する' : '追加する'}
        </SubmitButton>
      </div>
    </form>
  );
}
