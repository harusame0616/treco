import { Suspense } from 'react';

import {
  TrainingEventLabelContainer,
  TrainingEventLabelPresenter,
} from './training-event-label';
import {
  TrainingRecordEditFormContainer,
  TrainingRecordEditFormPresenter,
} from './training-record-edit-form';
import { TrainingSetsContainer, TrainingSetsPresenter } from './training-sets';

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
      <Suspense fallback={<TrainingEventLabelPresenter isSkeleton />}>
        <TrainingEventLabelContainer trainingRecordId={trainingRecordId} />
      </Suspense>
      <Suspense fallback={<TrainingSetsPresenter isSkeleton />}>
        <TrainingSetsContainer
          selectedIndex={selectedSetIndex}
          trainingRecordId={trainingRecordId}
        />
      </Suspense>
      <Suspense fallback={<TrainingRecordEditFormPresenter isSkeleton />}>
        <TrainingRecordEditFormContainer
          selectedSetIndex={selectedSetIndex}
          trainingRecordId={trainingRecordId}
        />
      </Suspense>
    </div>
  );
}
