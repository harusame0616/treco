import { TrainingRecordRepository } from './training-record.repository';

type Props = {
  trainingRecordId: string;
};

export class TrainingRecordDeleteUsecase {
  constructor(private trainingRecordRepository: TrainingRecordRepository) {}

  execute({ trainingRecordId }: Props) {
    return this.trainingRecordRepository.delete(trainingRecordId);
  }
}
