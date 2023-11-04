import { TrainingRecordRepository } from './training-record.repository';

type Props = {
  traineeId: string;
  trainingRecordId: string;
  trainingSetIndex: number;
};

export class TrainingRecordDeleteSetUsecase {
  constructor(private trainingRecordRepository: TrainingRecordRepository) {}

  async execute({ traineeId, trainingRecordId, trainingSetIndex }: Props) {
    const trainingRecord =
      await this.trainingRecordRepository.findOneById(trainingRecordId);

    if (!trainingRecord) {
      throw new Error('トレーニング記録が見つかりません');
    }

    if (!trainingRecord.isByTrainee(traineeId)) {
      throw new Error('トレーニング記録の作成者ではありません');
    }

    trainingRecord.deleteSet(trainingSetIndex);
    await this.trainingRecordRepository.save(trainingRecord);
  }
}
