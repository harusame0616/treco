import { TrainingRecord } from '../models/training-record';
import { TrainingRecordRepository } from './training-record.repository';

type Props = {
  traineeId: string;
  trainingDate: Date;
  trainingEventId: string;
};

export class TrainingRecordCreateUsecase {
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

  async execute({ traineeId, trainingDate, trainingEventId }: Props) {
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
      traineeId,
      trainingDate,
      trainingEventId,
    });

    await this.trainingRecordRepository.save(trainingRecord);
    return trainingRecord.toDto();
  }
}
