import { DeleteButton } from '@/components/delete-button';

import { deleteRecordAction } from './_actions/delete-record.action';

type Props = {
  trainingCategoryName: string;
  trainingEventName: string;
  trainingRecordId: string;
};
export function RecordDeleteButton({
  trainingCategoryName,
  trainingEventName,
  trainingRecordId,
}: Props) {
  return (
    <DeleteButton
      action={deleteRecordAction.bind(null, trainingRecordId)}
      description={`${trainingCategoryName}の${trainingEventName}の記録を削除しようとしています。この操作は取り消せません。`}
      submitLabel="トレーニング記録を削除する"
      title="本当にトレーニング記録を削除しますか？"
    />
  );
}
