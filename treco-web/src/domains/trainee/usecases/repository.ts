import { Trainee } from '../models/trainee';

export interface TraineeRepository {
  findOneById(traineeId: string): Promise<Trainee | null>;
}
