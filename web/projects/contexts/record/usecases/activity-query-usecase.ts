import { ActivityDto, ActivityFullId } from '../domains/activity/activity';
import { CategoryDto } from '../domains/category/category';
import { TrainingEventDto } from '../domains/training-event/training-event';

export type TrainingEventWithCategoryDto = TrainingEventDto & CategoryDto;

export type ActivityWithCategoryAndTrainingEventDto = CategoryDto &
  TrainingEventDto &
  ActivityDto;
export interface ActivityQuery {
  queryDetail(
    prop: ActivityFullId
  ): Promise<ActivityWithCategoryAndTrainingEventDto | null>;

  queryDetailOfLastTrainingEvent(
    prop: Omit<ActivityFullId, 'activityId'>
  ): Promise<ActivityWithCategoryAndTrainingEventDto | null>;

  queryListInMonth(prop: {
    userId: string;
    month: Date;
  }): Promise<ActivityWithCategoryAndTrainingEventDto[]>;
}

interface ConstructorProp {
  activityQuery: ActivityQuery;
}

export class ActivityQueryUsecase {
  constructor(private prop: ConstructorProp) {}

  async queryDetail(prop: ActivityFullId) {
    return await this.prop.activityQuery.queryDetail(prop);
  }

  async queryListInMonth(prop: { userId: string; month: Date }) {
    return await this.prop.activityQuery.queryListInMonth(prop);
  }

  async queryDetailOfLastTrainingEvent(
    prop: Omit<ActivityFullId, 'activityId'>
  ) {
    return await this.prop.activityQuery.queryDetailOfLastTrainingEvent(prop);
  }
}
