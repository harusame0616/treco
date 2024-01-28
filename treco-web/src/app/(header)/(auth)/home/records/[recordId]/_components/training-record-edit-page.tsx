import { TrainingEventLabelContainer } from './training-event-label';
import { TrainingRecordEditFormContainer } from './training-record-edit-form';
import { TrainingSetsContainer } from './training-sets';

type TrainingRecordEditPageProps = {
  selectedSetIndex?: number;
  trainingRecordId: string;
};
export default async function TrainingRecordEditPage({
  selectedSetIndex,
  trainingRecordId,
}: TrainingRecordEditPageProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <TrainingEventLabelContainer trainingRecordId={trainingRecordId} />
      <TrainingSetsContainer
        selectedIndex={selectedSetIndex}
        trainingRecordId={trainingRecordId}
      />
      <TrainingRecordEditFormContainer
        selectedSetIndex={selectedSetIndex}
        trainingRecordId={trainingRecordId}
      />
    </div>
  );
}
