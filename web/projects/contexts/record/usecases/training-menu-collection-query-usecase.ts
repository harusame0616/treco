import { TrainingMenuCollectionDto } from '@Domains/training-menu/training-menu-collection';

export interface TrainingMenuCollectionQuery {
  queryDetail(prop: {
    userId: string;
  }): Promise<TrainingMenuCollectionDto | null>;
}

interface ConstructorProp {
  trainingMenuCollectionQuery: TrainingMenuCollectionQuery;
}

export class TrainingMenuCollectionQueryUsecase {
  constructor(private prop: ConstructorProp) {}

  async queryDetail(prop: { userId: string }) {
    return await this.prop.trainingMenuCollectionQuery.queryDetail(prop);
  }
}
