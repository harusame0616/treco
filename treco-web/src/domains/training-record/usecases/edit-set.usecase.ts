import { IMTrainingRecordRepository } from '../infrastructures/im.repository';
import { TrainingSet } from '../models/training-record';

type Props = {
  trainingRecordId: string;
  traineeId: string;
  index: number;
} & TrainingSet;

export class TrainingRecordEditSetUsecase {
  trainingEventRepository = {
    async findOneById({ trainingEventId }: { trainingEventId: string }) {
      // TODO: not implemented
      return true;
    },
  };
  traineeRepository = {
    async findOneById({ traineeId }: { traineeId: string }) {
      // TODO: not implemented
      return true;
    },
  };
  private readonly trainingRecordRepository;

  constructor() {
    this.trainingRecordRepository = new IMTrainingRecordRepository();
  }
  async execute({
    trainingRecordId,
    traineeId,
    value,
    note,
    load,
    index,
  }: Props) {
    const trainingRecord = await this.trainingRecordRepository.findOneById(
      trainingRecordId
    );

    if (!trainingRecord) {
      console.error('TrainingRecord not found', {
        trainingRecordId,
      });
      throw new Error('TrainingRecord not found');
    }

    if (!trainingRecord.isByTrainee(traineeId)) {
      console.error('Record is not by trainee', {
        trainingRecord,
        traineeId,
      });
      throw new Error('Record is not by trainee');
    }

    trainingRecord.editSet({ index, value, note, load });
    await this.trainingRecordRepository.save(trainingRecord);
    return trainingRecord.toDto();
  }
}
