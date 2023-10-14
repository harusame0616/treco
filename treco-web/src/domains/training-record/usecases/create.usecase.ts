import { TrainingRecord } from '../models/training-record';
import { TrainingRecordRepository } from './training-record.repository';

type Props = {
  trainingEventId: string;
  traineeId: string;
  trainingDate: Date;
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

  constructor(private trainingRecordRepository: TrainingRecordRepository) {}

  async execute({ trainingEventId, traineeId, trainingDate }: Props) {
    console.log(trainingDate);
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
      traineeId,
      trainingDate,
    });

    await this.trainingRecordRepository.save(trainingRecord);
    return trainingRecord.toDto();
  }
}
