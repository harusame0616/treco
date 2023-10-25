export type TraineeDto = {
  traineeId: string;
};

export class Trainee {
  private constructor(private dto: TraineeDto) {}

  static fromDto(dto: TraineeDto) {
    return new Trainee(dto);
  }
}
