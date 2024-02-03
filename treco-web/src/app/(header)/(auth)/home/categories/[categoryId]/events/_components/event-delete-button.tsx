import { DeleteButton } from '@/components/delete-button';

import { deleteTrainingEventAction } from '../_actions/delete-training-event.action';

type DescriptionProps = {
  trainingEventName: string;
};
function Description({ trainingEventName }: DescriptionProps) {
  return (
    <>
      「{trainingEventName}
      」を削除しようとしています。
      この操作は取り消せません。また、関連する以下のデータも一緒に削除されます。
      <ul className="ml-4 mt-4 list-disc">
        <li>トレーニング記録</li>
      </ul>
    </>
  );
}

type Props = {
  trainingCategoryId: string;
  trainingEventId: string;
} & DescriptionProps;
export function EventDeleteButton({
  trainingCategoryId,
  trainingEventId,
  ...descriptionProps
}: Props) {
  return (
    <DeleteButton
      action={deleteTrainingEventAction.bind(null, {
        trainingCategoryId,
        trainingEventId,
      })}
      description={<Description {...descriptionProps} />}
      submitLabel="トレーニング種目を削除する"
      title="本当にトレーニング種目を削除しますか？"
    />
  );
}
