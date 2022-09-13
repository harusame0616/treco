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

  queryListOnDate(prop: {
    userId: string;
    date: Date;
  }): Promise<ActivityWithCategoryAndTrainingEventDto[]>;

  queryDetailOfmaxRM(prop: {
    userId: string;
    trainingEventId: string;
  }): Promise<(ActivityDto & { maxRM: number }) | null>;
}

interface ConstructorProp {
  activityQuery: ActivityQuery;
}

export class ActivityQueryUsecase {
  constructor(private prop: ConstructorProp) {}

  async queryDetail(prop: ActivityFullId) {
    return await this.prop.activityQuery.queryDetail(prop);
  }

  async queryListOnDate(prop: { userId: string; date: Date }) {
    return await this.prop.activityQuery.queryListOnDate(prop);
  }

  async queryListInMonth(prop: { userId: string; month: Date }) {
    return await this.prop.activityQuery.queryListInMonth(prop);
  }

  async queryDetailOfLastTrainingEvent(
    prop: Omit<ActivityFullId, 'activityId'>
  ) {
    return await this.prop.activityQuery.queryDetailOfLastTrainingEvent(prop);
  }

  async queryDetailOfmaxRM(prop: { userId: string; trainingEventId: string }) {
    return await this.prop.activityQuery.queryDetailOfmaxRM(prop);
  }
}
