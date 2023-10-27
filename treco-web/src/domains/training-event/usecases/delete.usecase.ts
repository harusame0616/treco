import { TrainingEventRepository } from './repository';

type ExecuteProps = {
  trainingEventId: string;
};

export class TrainingEventDeleteUsecase {
  constructor(private trainingEventRepository: TrainingEventRepository) {}

  async execute({ trainingEventId }: ExecuteProps) {
    await this.trainingEventRepository.delete(trainingEventId);
  }
}
