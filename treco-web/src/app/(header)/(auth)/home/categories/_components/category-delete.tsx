'use client';

import { DeleteButton } from '@/components/delete-button';

import { deleteTrainingCategoryAction } from '../_actions/delete-training-category.action';

function Description() {
  return (
    <>
      この操作は取り消せません。また、関連する以下のデータも一緒に削除されます。
      <span className="mt-8 block">・トレーニング種目</span>
      <span className="block">・トレーニング記録</span>
    </>
  );
}

type Props = {
  trainingCategoryId: string;
};
export function CategoryDelete(props: Props) {
  return (
    <DeleteButton
      action={() => deleteTrainingCategoryAction(props)}
      description={<Description />}
      submitLabel="トレーニングカテゴリーを削除する"
      title="本当にトレーニングカテゴリーを削除しますか？"
    />
  );
}
