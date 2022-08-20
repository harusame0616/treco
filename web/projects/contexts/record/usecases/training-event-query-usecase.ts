import { CategoryDto } from '../domains/category/category';
import { TrainingEventDto } from '../domains/training-event/training-event';
import { CategoryQuery } from './category-query-usecase';

export type TrainingEventWithCategoryDto = TrainingEventDto & CategoryDto;

export interface TrainingEventQuery {
  queryListInCategory(
    userId: string,
    categoryId: string
  ): Promise<TrainingEventWithCategoryDto[]>;
}

interface ConstructorProp {
  trainingEventQuery: TrainingEventQuery;
  categoryQuery: CategoryQuery;
}

export class TrainingEventQueryUsecase {
  constructor(private prop: ConstructorProp) {}

  async queryListInCategory(userId: string, categoryId: string) {
    if (userId == null || categoryId == null) {
      throw new ParameterError();
    }

    return await this.prop.trainingEventQuery.queryListInCategory(
      userId,
      categoryId
    );
  }
}
