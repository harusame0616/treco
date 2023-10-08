import { IMTrainingRecordRepository } from '../infrastructures/im.repository';
import { TrainingRecord } from '../models/training-record';

type Props = {
  trainingEventId: string;
  traineeId: string;
};

export class TrainingRecordCreateUsecase {
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
  async execute({ trainingEventId, traineeId }: Props) {
    const trainingEvent = await this.trainingEventRepository.findOneById({
      trainingEventId,
    });
    const trainee = await this.traineeRepository.findOneById({ traineeId });

    if (!trainingEvent) {
      console.error('TrainingEvent not found', {
        trainingEventId,
      });
      throw new Error('TrainingEvent not found');
    }

    if (!trainee) {
      console.error('Trainee not found', {
        traineeId,
      });
      throw new Error('Trainee not found');
    }

    const trainingRecord = TrainingRecord.create({
      trainingEventId,
    });

    await this.trainingRecordRepository.save(trainingRecord);
    return trainingRecord.toDto();
  }
}
