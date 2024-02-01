'use client';

import { DeleteButton } from '@/components/delete-button';

import { deleteTrainingEventAction } from '../_actions/delete-training-event.action';

function Description() {
  return (
    <>
      この操作は取り消せません。また、関連する以下のデータも一緒に削除されます。
      <span className="mt-8 block">・トレーニング記録</span>
    </>
  );
}

type Props = {
  trainingCategoryId: string;
  trainingEventId: string;
};
export function EventDelete(props: Props) {
  return (
    <DeleteButton
      action={() => deleteTrainingEventAction(props)}
      description={<Description />}
      submitLabel="トレーニング種目を削除する"
      title="本当にトレーニング種目を削除しますか？"
    />
  );
}
