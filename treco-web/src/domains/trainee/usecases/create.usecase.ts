import { Trainee, TraineeDto } from '../models/trainee';
import { TraineeRepository } from './repository';

type ExecuteProps = Parameters<(typeof Trainee)['create']>[0];

export class TraineeCreateUsecase {
  constructor(private readonly traineeRepository: TraineeRepository) {}

  async execute(props: ExecuteProps): Promise<TraineeDto> {
    const trainee = Trainee.create(props);
    await this.traineeRepository.save(trainee);

    return trainee.toDto();
  }
}
