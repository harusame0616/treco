import { NotFoundError } from '../../../custom-error/not-found-error';
import {
  Activity,
  ActivityDto,
  ActivityFullId,
  ActivityRecord,
} from '../domains/activity/activity';

export interface ActivityRepository {
  insert(activity: Activity): Promise<void>;
  save(activity: Activity): Promise<void>;
  findOne(prop: {
    userId: string;
    categoryId: string;
    trainingEventId: string;
    activityId: string;
  }): Promise<Activity | null>;
  delete(activity: Activity): Promise<void>;
}

interface ConstructorProp {
  activityRepository: ActivityRepository;
}

export class ActivityCommandUsecase {
  constructor(private prop: ConstructorProp) {}

  async createNewActivity(prop: {
    userId: string;
    categoryId: string;
    trainingEventId: string;
    date: Date;
  }): Promise<ActivityDto> {
    const activity = Activity.create({
      userId: prop.userId,
      categoryId: prop.categoryId,
      trainingEventId: prop.trainingEventId,
      date: prop.date,
    });

    await this.prop.activityRepository.insert(activity);
    return activity.toDto();
  }

  async updateActivityRecord(prop: {
    userId: string;
    categoryId: string;
    trainingEventId: string;
    activityId: string;
    records: ActivityRecord[];
  }): Promise<ActivityDto> {
    const activity = await this.prop.activityRepository.findOne(prop);
    if (!activity) {
      throw new NotFoundError();
    }

    activity.updateRecords(prop.records);
    await this.prop.activityRepository.save(activity);
    return activity.toDto();
  }

  async deleteActivity(prop: ActivityFullId) {
    const activity = await this.prop.activityRepository.findOne(prop);

    if (activity) {
      await this.prop.activityRepository.delete(activity);
    }
  }
}
