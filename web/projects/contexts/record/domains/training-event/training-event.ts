interface ConstructorProp {
  categoryId: string;
  trainingEventId: string;
  trainingEventName: string;
  index: number;
}

export interface TrainingEventDto {
  categoryId: string;
  trainingEventId: string;
  trainingEventName: string;
  loadUnit: string;
  valueUnit: string;
  index: number;
}

export class TrainingEvent {
  constructor(private prop: ConstructorProp) {}
}
