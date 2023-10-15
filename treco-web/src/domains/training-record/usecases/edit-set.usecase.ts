import { TrainingSet } from '../models/training-record';
import { TrainingRecordRepository } from './training-record.repository';

type Props = {
  index: number;
  traineeId: string;
  trainingRecordId: string;
} & TrainingSet;

export class TrainingRecordEditSetUsecase {
  traineeRepository = {
    async findOneById(_: { traineeId: string }) {
      // TODO: not implemented
      return true;
    },
  };
  trainingEventRepository = {
    async findOneById(_: { trainingEventId: string }) {
      // TODO: not implemented
      return true;
    },
  };

  constructor(private trainingRecordRepository: TrainingRecordRepository) {}

  async execute({
    index,
    load,
    note,
    traineeId,
    trainingRecordId,
    value,
  }: Props) {
    const trainingRecord =
      await this.trainingRecordRepository.findOneById(trainingRecordId);

    if (!trainingRecord) {
      console.error('TrainingRecord not found', {
        trainingRecordId,
      });
      throw new Error('TrainingRecord not found');
    }

    if (!trainingRecord.isByTrainee(traineeId)) {
      console.error('Record is not by trainee', {
        traineeId,
        trainingRecord,
      });
      throw new Error('Record is not by trainee');
    }

    trainingRecord.editSet({ index, load, note, value });
    await this.trainingRecordRepository.save(trainingRecord);
    return trainingRecord.toDto();
  }
}
