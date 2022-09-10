import { RequireError } from '@Errors/require-error';
import { ParameterError } from '../../../custom-error/parameter-error';
import { CategoryDto } from '../domains/category/category';
import {
  TrainingEventDto,
  TrainingEventFullId,
} from '../domains/training-event/training-event';

export type TrainingEventWithCategoryDto = TrainingEventDto & CategoryDto;

export interface TrainingEventQuery {
  queryDetail(
    userId: string,
    categoryId: string,
    trainingEventId: string
  ): Promise<TrainingEventWithCategoryDto | null>;

  queryListInCategory(
    userId: string,
    categoryId: string
  ): Promise<TrainingEventWithCategoryDto[]>;

  queryList(
    prop: Omit<TrainingEventFullId, 'categoryId' | 'trainingEventId'>
  ): Promise<TrainingEventWithCategoryDto[]>;
}

interface ConstructorProp {
  trainingEventQuery: TrainingEventQuery;
}

export class TrainingEventQueryUsecase {
  constructor(private prop: ConstructorProp) {}

  async queryDetail(
    userId: string,
    categoryId: string,
    trainingEventId: string
  ) {
    return await this.prop.trainingEventQuery.queryDetail(
      userId,
      categoryId,
      trainingEventId
    );
  }

  async queryList(
    prop: Omit<TrainingEventFullId, 'categoryId' | 'trainingEventId'>
  ) {
    if (prop.userId == null) {
      throw new RequireError('ユーザーID');
    }

    return await this.prop.trainingEventQuery.queryList(prop);
  }

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
