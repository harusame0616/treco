import { ActivityDto } from '../domains/activity/activity';
import { CategoryDto } from '../domains/category/category';
import { TrainingEventDto } from '../domains/training-event/training-event';

export type TrainingEventWithCategoryDto = TrainingEventDto & CategoryDto;

export type ActivityWithCategoryAndTrainingEventDto = CategoryDto &
  TrainingEventDto &
  ActivityDto;
export interface ActivityQuery {
  queryListInMonth(
    userId: string,
    date: Date
  ): Promise<ActivityWithCategoryAndTrainingEventDto[]>;
}

interface ConstructorProp {
  activityQuery: ActivityQuery;
}

export class ActivityQueryUsecase {
  constructor(private prop: ConstructorProp) {}

  async queryListInMonth(userId: string, month: Date) {
    return await this.prop.activityQuery.queryListInMonth(userId, month);
  }
}
