import { DeleteButton } from '@/components/delete-button';

import { deleteTrainingCategoryAction } from '../_actions/delete-training-category.action';

type DescriptionProps = {
  trainingCategoryName: string;
};
function Description({ trainingCategoryName }: DescriptionProps) {
  const relationDataNames = ['トレーニング種目', 'トレーニング記録'];

  return (
    <>
      「{trainingCategoryName}」
      を削除しようとしています。この操作は取り消せません。また、関連する以下のデータも一緒に削除されます。
      <ul className="ml-4 mt-4 list-disc">
        {relationDataNames.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </>
  );
}

type Props = {
  trainingCategoryId: string;
} & DescriptionProps;
export function CategoryDeleteButton({
  trainingCategoryId,
  trainingCategoryName,
}: Props) {
  return (
    <DeleteButton
      action={deleteTrainingCategoryAction.bind(null, trainingCategoryId)}
      description={<Description trainingCategoryName={trainingCategoryName} />}
      submitLabel="トレーニングカテゴリーを削除する"
      title="本当にトレーニングカテゴリーを削除しますか？"
    />
  );
}
