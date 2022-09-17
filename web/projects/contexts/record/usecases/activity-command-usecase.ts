import {
  Activity,
  ActivityDto,
  ActivityFullId,
  CreateProp,
} from '@Domains/activity/activity';
import { NotFoundError } from '@Errors/not-found-error';
import { CategoryRepository } from '@Usecases/category-command-usecase';
import { TrainingEventRepository } from '@Usecases/training-event-command-usecase';

export interface ActivityRepository {
  insert(activity: Activity): Promise<void>;
  save(activity: Activity): Promise<void>;
  findOne(prop: ActivityFullId): Promise<Activity | null>;
  delete(activity: Activity): Promise<void>;
}

interface ConstructorProp {
  activityRepository: ActivityRepository;
  categoryRepository: CategoryRepository;
  trainingEventRepository: TrainingEventRepository;
}

export class ActivityCommandUsecase {
  constructor(private prop: ConstructorProp) {}

  async createNewActivity(prop: CreateProp): Promise<ActivityDto> {
    const [category, trainingEvent] = await Promise.all([
      this.prop.categoryRepository.findOneByCategoryId(prop),
      this.prop.trainingEventRepository.findOneByTrainingEventId(prop),
    ]);

    if (!category) {
      throw new NotFoundError('カテゴリが見つかりません。');
    }
    if (!trainingEvent) {
      throw new NotFoundError('トレーニング種目が見つかりません。');
    }

    const activity = Activity.create(prop);

    await this.prop.activityRepository.insert(activity);
    return activity.toDto();
  }

  async updateActivityRecord({
    records,
    ...fullId
  }: Omit<ActivityDto, 'date' | 'createdAt'>): Promise<ActivityDto> {
    const activity = await this.prop.activityRepository.findOne(fullId);
    if (!activity) {
      throw new NotFoundError('アクティビティが見つかりません。');
    }

    activity.updateRecords(records);
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
