import { TrainingEventRepository } from './repository';

type ExecuteProps = {
  loadUnit: string;
  name: string;
  trainingEventId: string;
  valueUnit: string;
};

export class TrainingEventEditUsecase {
  constructor(private trainingEventRepository: TrainingEventRepository) {}

  async execute({ loadUnit, name, trainingEventId, valueUnit }: ExecuteProps) {
    const trainingEvent =
      await this.trainingEventRepository.findOneById(trainingEventId);

    if (!trainingEvent) {
      throw new Error('トレーニング種目が見つかりません');
    }

    trainingEvent.changeName(name);
    trainingEvent.changeLoadUnit(loadUnit);
    trainingEvent.changeValueUnit(valueUnit);

    await this.trainingEventRepository.save(trainingEvent);
  }
}
