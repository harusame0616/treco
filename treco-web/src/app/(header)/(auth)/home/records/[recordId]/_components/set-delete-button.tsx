import { DeleteButton } from '@/components/delete-button';

import { deleteSetAction } from '../_actions';

type Props = {
  trainingRecordId: string;
  trainingSetIndex: number;
};
export function SetDeleteButton(props: Props) {
  return (
    <DeleteButton
      action={deleteSetAction.bind(null, props)}
      description="この操作は取り消せません"
      submitLabel="トレーニングセットを削除する"
      title="本当にトレーニングセットを削除しますか？"
    />
  );
}
