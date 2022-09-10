import {
  TrainingMenuDto,
  TrainingMenuFullId,
} from '@Domains/training-menu/training-menu';
import { TrainingMenuCollectionDto } from '@Domains/training-menu/training-menu-collection';
import { TrainingEventWithCategoryDto } from './training-event-query-usecase';

export type TrainingMenuWithTrainingEventsDto = TrainingMenuDto & {
  trainingEvents: TrainingEventWithCategoryDto[];
};

export interface TrainingMenuCollectionQuery {
  queryDetail(prop: {
    userId: string;
  }): Promise<TrainingMenuCollectionDto | null>;
  queryTrainingMenuByTrainingMenuId(
    prop: TrainingMenuFullId
  ): Promise<TrainingMenuWithTrainingEventsDto | null>;
}

interface ConstructorProp {
  trainingMenuCollectionQuery: TrainingMenuCollectionQuery;
}

export class TrainingMenuCollectionQueryUsecase {
  constructor(private prop: ConstructorProp) {}

  async queryDetail(prop: { userId: string }) {
    return await this.prop.trainingMenuCollectionQuery.queryDetail(prop);
  }

  async queryTrainingMenuByTrainingMenuId(prop: TrainingMenuFullId) {
    return await this.prop.trainingMenuCollectionQuery.queryTrainingMenuByTrainingMenuId(
      prop
    );
  }
}
